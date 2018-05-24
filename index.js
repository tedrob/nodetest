const cool = require('cool-ascii-faces');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const { Client, Pool } = require('pg');
const pgp = require ('pg-promise')(/* options */);
pgp.pg.defaults.ssl = true;
const assert = require('assert');

const cn = {
  connectionString: process.env.DATABASE_URL
}

const db = pgp('postgres://axwxwddyqhbity:64cec3027248eedfa68f8b572e08c17ccb666e6df3bb755769fb641c6baf0963@ec2-23-23-130-158.compute-1.amazonaws.com:5432/dcugu53beu8p4j');

db.any('SELECT * FROM test_table')
 .then((data) => {
   console.log('Data', data);
 })
 .catch((error) => {
   console.log('Error', error);
 });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

client.connect();

client.query('SELECT table_schema, table_name FROMinformation_schema.tables;',
  (err, res)  =>{
    if (err) { 
      console.log(err);
      throw err;
    }
    for (let row of res.rows) {
      console.log(JSON.stringify(row));
    }
    client.end();
  });

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .get('/times', (req, res) => {
    let result = '';
    const times = process.env.Times || 5
    for (i = 0; i < times; i++) {
      result += i + ' ';
    }
    res.send(result);
  })
  .get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      res.render('pages/db', result);
      cleint.release();
    } catch (err) {
      assert.isNotOk(error, 'Promise error');
      done();      
      console.error(err);
      res.send("Error " + err);
      done();
    }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
