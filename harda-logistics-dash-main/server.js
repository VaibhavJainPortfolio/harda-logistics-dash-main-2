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

    const [
      accounts,
      openingBalances,
      bankDetails,
      gstDetails,
      acSetup,
      vehicles,
      drivers,
      routes,
    ] = await Promise.all([
      pool.request().query(
        "SELECT acCode, name, shortName, panNo AS pan, branchId FROM AccountMaster"
      ),
      pool.request().query(
        "SELECT acCode, opBalance, branchId FROM AcOpeningBalance"
      ),
      pool.request().query(
        "SELECT accountNo, bank, city, ifsCode AS ifscCode FROM AccountBankDetails"
      ),
      pool.request().query(
        "SELECT acCode, gstNo, stateName, stateId FROM AccountGSTDetails"
      ),
      pool.request().query(
        "SELECT branchId, sessionId, VouNopaidGr AS paidGrp FROM AcSetup"
      ),
      pool.request().query(
        `SELECT DISTINCT 
          V.VehicleNo AS vehicleNo,
          V.owner AS owner,
          DATEADD(YEAR, 1, InsuranceDate) AS insuranceExpiry,
          DATEADD(MONTH, 6, InsuranceDate) AS pucExpiry,
          DATEADD(YEAR, 5, InsuranceDate) AS greenTaxExpiry,
          CASE 
            WHEN ISNUMERIC(D.StationId) = 1 
              THEN 'RT' + RIGHT('000' + CAST(D.StationId AS VARCHAR), 3) 
            ELSE NULL 
          END AS routeId
        FROM dbo.VehicleMaster V
        INNER JOIN dbo.GMemoM G ON G.LorryNo = V.VehicleNo
        INNER JOIN dbo.DestinationMaster D ON D.DeliveryAt = G.To1`
      ),
      pool.request().query(
        `SELECT 
          DM.Dname AS driverName,
          DM.Validupto AS licenseExpiryDate,
          DM.AadharNo AS aadhaar,
          CASE 
            WHEN ISNUMERIC(DM.DriverId) = 1 
              THEN 'RT' + RIGHT('000' + CAST(DM.DriverId AS VARCHAR), 3) 
            ELSE NULL 
          END AS routeAssigned,
          DM.Phone AS contactNo
        FROM dbo.DriverMaster DM
        INNER JOIN dbo.GMemoM G ON G.Driver = DM.Dname
        INNER JOIN dbo.DestinationMaster D ON D.DeliveryAt = G.To1`
      ),
      pool.request().query(
        `SELECT DISTINCT 
          CASE 
            WHEN ISNUMERIC(D.StationId) = 1 
              THEN 'RT' + RIGHT('000' + CAST(D.StationId AS VARCHAR), 3) 
            ELSE NULL 
          END AS routeId,
          V.VehicleNo AS vehicleNo,
          G.Driver AS driverName,
          G.DocDate AS assignedDate,
          DATEADD(DAY, 2, G.DocDate) AS eta,
          DATEADD(DAY, 3, G.DocDate) AS completionTime,
          CASE 
            WHEN GETDATE() < G.DocDate THEN 'Pending'
            WHEN GETDATE() >= DATEADD(DAY, 3, G.DocDate) AND DATEADD(DAY, 3, G.DocDate) <= DATEADD(DAY, 2, G.DocDate) THEN 'On Time'
            WHEN GETDATE() >= DATEADD(DAY, 3, G.DocDate) AND DATEADD(DAY, 3, G.DocDate) > DATEADD(DAY, 2, G.DocDate) THEN 'Delayed'
            ELSE 'Completed'
          END AS status
        FROM dbo.VehicleMaster V
        INNER JOIN dbo.GMemoM G ON G.LorryNo = V.VehicleNo
        INNER JOIN dbo.DestinationMaster D ON D.DeliveryAt = G.To1`
      ),
    ]);

    res.json({
      accounts: accounts.recordset,
      openingBalances: openingBalances.recordset,
      bankDetails: bankDetails.recordset,
      gstDetails: gstDetails.recordset,
      acSetup: acSetup.recordset,
      vehicles: vehicles.recordset,
      drivers: drivers.recordset,
      routes: routes.recordset,
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
  console.log(`Server running on port ${PORT}`);
});