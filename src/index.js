import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

const mongo = new MongoClient(
  // eslint-disable-next-line max-len
  `mongodb://${process.env.NX_MONGO}@${process.env.NX_MONGO_HOST}/produtos?ssl=true&replicaSet=nx-b2b-clienteb-shard-0&authSource=admin&retryWrites=false&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  },
);

async function main() {
  try {
    const conn = await mongo.connect();
    const db = conn.db('produtos');
    const collName = 'produtos';
    const collection = db.collection(collName);

    collection.find = new Proxy(collection.find, {
      apply(target, thisArg, argumentsList) {
        const [filter, ...args] = argumentsList;
        const query = {
          ...filter,
          companies: {
            $in: [ObjectId.createFromHexString('607100a17d0eaf3ff49d7a81')],
          },
        };

        // BR: Before query

        const cursor = target.apply(collection, [query, ...args]);
        cursor.comment(`find.${collName}_by_userName`);

        // BR: After query

        // Remove secrets from the result
        return cursor.map(({ peso, ...doc }) => {
          // BR: Display
          // PII decryption here

          // Apply business rules here and transforms
          // eslint-disable-next-line no-param-reassign
          doc.validated = true;
          return doc;
        });
      },
    });

    collection.insertOne = new Proxy(collection.insertOne, {
      async apply(target, thisArg, argumentsList) {
        const [doc, ...args] = argumentsList;
        const record = {
          ...doc,
          companies: [ObjectId.createFromHexString('607100a17d0eaf3ff49d7a81')],
        };

        // BR: Before insert
        // PII encryption here

        const result = await target.apply(collection, [record, ...args]);

        // BR: After insert

        return result;
      },
    });

    const result = await collection.insertOne({
      nome: 'Produto 1',
      peso: 1,
      marca: 'ACME',
      embalagem: 'caixa',
    });

    console.info(result);

    const docs = await collection.find({}).toArray();
    console.log(docs);
  } catch (err) {
    console.error(err);
  } finally {
    await mongo.close();
  }
}

main();
