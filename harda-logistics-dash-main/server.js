import express from 'express';
import sql from 'mssql';
import cors from 'cors';

const app = express();
app.use(cors());

const config = {
  user: 'hrdIndre2223',
  password: 'in$Hard2223',
  server: 'eeeit.work',
  database: 'HardaIndoreERP2223',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

app.get('/api/data', async (req, res) => {
  let pool;
  try {
    pool = await sql.connect(config);

    // Create requests and run queries in parallel
    const [
      accounts,
      openingBalances,
      bankDetails,
      gstDetails,
      acSetup,
    ] = await Promise.all([
      pool.request().query('SELECT acCode, name, shortName, panNo as pan, branchId FROM AccountMaster'),
      pool.request().query('SELECT acCode, opBalance, branchId FROM AcOpeningBalance'),
      pool.request().query('SELECT accountNo, bank, city, ifsCode as ifscCode FROM AccountBankDetails'),
      pool.request().query('SELECT acCode, gstNo, stateName, stateId FROM AccountGSTDetails'),
      pool.request().query('SELECT branchId, sessionId, VouNopaidGr as paidGrp FROM AcSetup'),
    ]);

    res.json({
      accounts: accounts.recordset,
      openingBalances: openingBalances.recordset,
      bankDetails: bankDetails.recordset,
      gstDetails: gstDetails.recordset,
      acSetup: acSetup.recordset,
    });
  } catch (err) {
    console.error('Error fetching ERP data:', err);
    res.status(500).send('Server error');
  } finally {
    if (pool) await pool.close();
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://192.168.1.5:${PORT}`);
});
