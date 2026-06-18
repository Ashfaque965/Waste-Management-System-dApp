// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ReportingService
 * @dev Smart contract for generating automated reports on waste management activities
 */
contract ReportingService is Ownable {

    struct MonthlyReport {
        uint256 year;
        uint256 month;
        uint256 totalWasteCollected; // in kg
        uint256 totalWasteVerified; // in kg
        uint256 totalCollections;
        uint256 totalRecycled; // in kg
        uint256 recyclingRate; // percentage
        uint256 generatedAt;
        string reportHash; // IPFS hash
    }

    struct YearlyReport {
        uint256 year;
        uint256 totalWasteCollected;
        uint256 totalWasteVerified;
        uint256 totalCollections;
        uint256 totalRecycled;
        uint256 averageRecyclingRate;
        uint256 generatedAt;
        string reportHash;
    }

    struct EnvironmentalImpact {
        uint256 co2Saved; // in kg CO2 equivalent
        uint256 waterSaved; // in liters
        uint256 energySaved; // in kWh
        uint256 recyclableMaterialRecovered; // in kg
    }

    // Reports storage
    mapping(uint256 => mapping(uint256 => MonthlyReport)) public monthlyReports;
    mapping(uint256 => YearlyReport) public yearlyReports;
    mapping(uint256 => EnvironmentalImpact) public environmentalImpacts;

    // Report tracking
    uint256[] public reportYears;
    mapping(uint256 => uint256[]) public reportMonths;

    // Constants for environmental impact calculations
    uint256 public constant CO2_PER_KG_RECYCLED = 3; // 3 kg CO2 saved per kg recycled
    uint256 public constant WATER_PER_KG_RECYCLED = 10; // 10L water saved per kg recycled
    uint256 public constant ENERGY_PER_KG_RECYCLED = 2; // 2 kWh energy saved per kg recycled

    // Events
    event MonthlyReportGenerated(
        uint256 indexed year,
        uint256 indexed month,
        uint256 totalCollected,
        uint256 totalRecycled,
        string reportHash,
        uint256 timestamp
    );

    event YearlyReportGenerated(
        uint256 indexed year,
        uint256 totalCollected,
        uint256 totalRecycled,
        string reportHash,
        uint256 timestamp
    );

    event EnvironmentalImpactCalculated(
        uint256 indexed collectionId,
        uint256 co2Saved,
        uint256 waterSaved,
        uint256 energySaved
    );

    /**
     * @dev Generate a monthly report
     */
    function generateMonthlyReport(
        uint256 _year,
        uint256 _month,
        uint256 _totalWasteCollected,
        uint256 _totalWasteVerified,
        uint256 _totalCollections,
        uint256 _totalRecycled,
        string memory _reportHash
    ) 
        external 
        onlyOwner 
    {
        require(_month >= 1 && _month <= 12, "Invalid month");
        require(bytes(_reportHash).length > 0, "Report hash required");

        uint256 recyclingRate = 0;
        if (_totalWasteVerified > 0) {
            recyclingRate = (_totalRecycled * 100) / _totalWasteVerified;
        }

        MonthlyReport storage report = monthlyReports[_year][_month];
        report.year = _year;
        report.month = _month;
        report.totalWasteCollected = _totalWasteCollected;
        report.totalWasteVerified = _totalWasteVerified;
        report.totalCollections = _totalCollections;
        report.totalRecycled = _totalRecycled;
        report.recyclingRate = recyclingRate;
        report.generatedAt = block.timestamp;
        report.reportHash = _reportHash;

        // Track report years and months
        if (monthlyReports[_year][1].generatedAt == 0) {
            reportYears.push(_year);
        }
        reportMonths[_year].push(_month);

        // Calculate environmental impact
        calculateEnvironmentalImpact(_totalRecycled);

        emit MonthlyReportGenerated(
            _year,
            _month,
            _totalWasteCollected,
            _totalRecycled,
            _reportHash,
            block.timestamp
        );
    }

    /**
     * @dev Generate a yearly report
     */
    function generateYearlyReport(
        uint256 _year,
        uint256 _totalWasteCollected,
        uint256 _totalWasteVerified,
        uint256 _totalCollections,
        uint256 _totalRecycled,
        string memory _reportHash
    ) 
        external 
        onlyOwner 
    {
        require(bytes(_reportHash).length > 0, "Report hash required");

        uint256 averageRecyclingRate = 0;
        if (_totalWasteVerified > 0) {
            averageRecyclingRate = (_totalRecycled * 100) / _totalWasteVerified;
        }

        YearlyReport storage report = yearlyReports[_year];
        report.year = _year;
        report.totalWasteCollected = _totalWasteCollected;
        report.totalWasteVerified = _totalWasteVerified;
        report.totalCollections = _totalCollections;
        report.totalRecycled = _totalRecycled;
        report.averageRecyclingRate = averageRecyclingRate;
        report.generatedAt = block.timestamp;
        report.reportHash = _reportHash;

        emit YearlyReportGenerated(
            _year,
            _totalWasteCollected,
            _totalRecycled,
            _reportHash,
            block.timestamp
        );
    }

    /**
     * @dev Calculate environmental impact
     */
    function calculateEnvironmentalImpact(uint256 _totalRecycled) 
        internal 
    {
        uint256 co2Saved = _totalRecycled * CO2_PER_KG_RECYCLED;
        uint256 waterSaved = _totalRecycled * WATER_PER_KG_RECYCLED;
        uint256 energySaved = _totalRecycled * ENERGY_PER_KG_RECYCLED;

        uint256 lastRecordId = block.timestamp;
        environmentalImpacts[lastRecordId] = EnvironmentalImpact({
            co2Saved: co2Saved,
            waterSaved: waterSaved,
            energySaved: energySaved,
            recyclableMaterialRecovered: _totalRecycled
        });

        emit EnvironmentalImpactCalculated(
            lastRecordId,
            co2Saved,
            waterSaved,
            energySaved
        );
    }

    /**
     * @dev Get monthly report
     */
    function getMonthlyReport(uint256 _year, uint256 _month) 
        external 
        view 
        returns (MonthlyReport memory) 
    {
        return monthlyReports[_year][_month];
    }

    /**
     * @dev Get yearly report
     */
    function getYearlyReport(uint256 _year) 
        external 
        view 
        returns (YearlyReport memory) 
    {
        return yearlyReports[_year];
    }

    /**
     * @dev Get environmental impact data
     */
    function getEnvironmentalImpact(uint256 _id) 
        external 
        view 
        returns (EnvironmentalImpact memory) 
    {
        return environmentalImpacts[_id];
    }

    /**
     * @dev Get all report years
     */
    function getReportYears() 
        external 
        view 
        returns (uint256[] memory) 
    {
        return reportYears;
    }

    /**
     * @dev Get report months for a year
     */
    function getReportMonths(uint256 _year) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return reportMonths[_year];
    }
}
