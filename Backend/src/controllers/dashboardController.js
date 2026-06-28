const pool = require("../config/db");

const getDashboard = async (req, res) => {

    const { companyId } = req.params;

    const ledger =
        await pool.query(
            "SELECT COUNT(*) FROM ledgers WHERE company_id=$1",
            [companyId]
        );

    const groups =
        await pool.query(
            "SELECT COUNT(*) FROM groups WHERE company_id=$1",
            [companyId]
        );

    const stockGroups =
        await pool.query(
            "SELECT COUNT(*) FROM stock_groups WHERE company_id=$1",
            [companyId]
        );

    const units =
        await pool.query(
            "SELECT COUNT(*) FROM units WHERE company_id=$1",
            [companyId]
        );

    const stockItems =
        await pool.query(
            "SELECT COUNT(*) FROM stock_items WHERE company_id=$1",
            [companyId]
        );

    res.json({

        success:true,

        ledgerCount:ledger.rows[0].count,

        groupCount:groups.rows[0].count,

        stockGroupCount:stockGroups.rows[0].count,

        unitCount:units.rows[0].count,

        stockItemCount:stockItems.rows[0].count

    });

};

module.exports={
    getDashboard
};