const db = require('../db.js');
const RAIO_MAXIMO_METROS = 5000;
const FRETE_MAX = 20;
const Conjunto = {
    /**
   * Insere um novo conjunto na tabela `conjunto`.
   *
   * @param {number} frete_max   - valor máximo de frete para este conjunto
   * @param {number} raio_metros - raio de validade em metros
   * @param {number} longitude   - longitude do centro do conjunto
   * @param {number} latitude    - latitude do centro do conjunto
   * @returns {Promise<number|null>} o `id_conjunto` criado, ou `null` em caso de erro
   */
    criarConjunto: async (longitude, latitude) => {
        const sql = `
      INSERT INTO conjunto 
        (frete_max, raio_metros, longitude, latitude)
      VALUES (?, ?, ?, ?)
    `;
        try {
            const result = await new Promise((resolve, reject) => {
                db.query(sql, [FRETE_MAX, RAIO_MAXIMO_METROS, longitude, latitude], (err, res) => {
                    if (err) return reject(err);
                    resolve(res);
                });
            });
            return result.insertId;
        } catch (error) {
            console.error('Erro ao criar conjunto:', error);
            return null;
        }
    },


    buscarPorLocalEIdProduto: async (long, lat, id_produto) => {
        const sql1 = `
      SELECT DISTINCT c.id_conjunto
      FROM compra AS c
      JOIN produto_oferta AS po1
        ON c.id_produto = po1.id_produto
      JOIN produto_oferta AS po2
        ON po1.id_oferta = po2.id_oferta
       AND po2.id_produto = ?
    `;
        const sql2 = `SELECT * FROM conjunto WHERE id_conjunto = ?`;

        try {
            // 1) pega só os IDs
            const rows1 = await new Promise((resolve, reject) => {
                db.query(sql1, [id_produto], (err, rows) =>
                    err ? reject(err) : resolve(rows),
                );
            });

            const idConjuntos = rows1.map(r => r.id_conjunto);
            
            // 2) busca todos os objetos
            const conjuntosDetalhados = await Promise.all(
                idConjuntos.map(idC =>
                    new Promise((resolve, reject) => {
                        db.query(sql2, [idC], (err, rows) =>
                            err ? reject(err) : resolve(rows[0])
                        );
                    })
                )
            );
            // 3) usa reduce para filtrar pelo raio
            const dentroDoRaio = conjuntosDetalhados.reduce((acc, conjunto) => {
                // conjunto.latitude e conjunto.longitude são strings ou números

                //verificacao NOJENTA, FEITO DE REMENDOS ESTOY CANSADO
                if(!conjunto){
                    return acc
                }
                const latC = Number(conjunto.latitude);
                const lonC = Number(conjunto.longitude);
                
                if (isWithinRadius(Number(lat), Number(long), latC, lonC, RAIO_MAXIMO_METROS)) {
            
                    acc.push(conjunto);
                }
                return acc;
            }, []);
            console.log('Conjuntos dentro do raio:', dentroDoRaio);
            // agora você pode retornar ou usar `dentroDoRaio`
            // return dentroDoRaio;
            return dentroDoRaio
        } catch (error) {
            console.error('Erro ao buscar conjuntos por produto:', error);
        }
    }
};

// as mesmas funções de antes
function isWithinRadius(lat1, lon1, lat2, lon2, maxRadius) {
    return haversineDistance(lat1, lon1, lat2, lon2) <= maxRadius;
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = x => (x * Math.PI) / 180;
    const R = 6371000;
    const φ1 = toRad(lat1), φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1), Δλ = toRad(lon2 - lon1);
    const a =
        Math.sin(Δφ / 2) ** 2 +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

module.exports = Conjunto;
