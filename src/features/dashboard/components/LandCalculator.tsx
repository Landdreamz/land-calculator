import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  TextareaAutosize,
  Alert,
  Collapse,
  IconButton,
  Tooltip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import InfoIcon from '@mui/icons-material/Info';

const MAJOR_COUNTIES = ['Harris', 'Dallas', 'Travis'];
const SQUARE_FEET_PER_ACRE = 43560;

const FLOOD_ZONES = {
  CLEAR: 'Clear from Flood zone',
  HUNDRED_YEAR: '100-Year Floodplain',
  HUNDRED_YEAR_WAY: '100-Year Floodway',
  FIVE_HUNDRED_YEAR: '500-Year Floodplain',
  COASTAL_HUNDRED_YEAR: 'Costal 100-Year Floodplain',
  COASTAL_HUNDRED_YEAR_WAY: 'Costal 100-Year Floodway',
  UNDETERMINED: 'Undetermined'
};

type FloodZoneValues = (typeof FLOOD_ZONES)[keyof typeof FLOOD_ZONES];

interface CalculationResult {
  totalAcres: number;
  baseValue: number;
  sitePrepCost: number;
  adjustedValue: number;
  finalValue: number;
  valuePerAcre: number;
  totalImpact: number;
  impactPercentage: number;
}

export const LandCalculator: React.FC = () => {
  const [acres, setAcres] = useState<string>('');
  const [squareFeet, setSquareFeet] = useState<string>('');
  const [baseValue, setBaseValue] = useState<string>('');
  const [appraisalValue, setAppraisalValue] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [debrisLevel, setDebrisLevel] = useState<string>('');
  const [slope, setSlope] = useState<string>('');
  const [trees, setTrees] = useState<string>('');
  const [needsWell, setNeedsWell] = useState<string>('');
  const [needsSeptic, setNeedsSeptic] = useState<string>('');
  const [floodZone, setFloodZone] = useState<FloodZoneValues | ''>('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [pasteInput, setPasteInput] = useState<string>('');
  const [showQuickInput, setShowQuickInput] = useState<boolean>(true);
  const [parseError, setParseError] = useState<string>('');
  
  // Comp 1 states
  const [comp1PasteInput, setComp1PasteInput] = useState<string>('');
  const [showComp1QuickInput, setShowComp1QuickInput] = useState<boolean>(true);
  const [comp1ParseError, setComp1ParseError] = useState<string>('');
  const [comp1Data, setComp1Data] = useState({
    acres: '',
    squareFeet: '',
    salePrice: '',
    appraisalValue: '',
    address: '',
    debrisLevel: '',
    slope: '',
    trees: '',
    needsWell: '',
    needsSeptic: '',
    floodZone: '' as FloodZoneValues | '',
    dom: '',
    pricePerSqFt: '',
    pricePerAcre: '',
    closeDate: ''
  });

  // Comp 2 states
  const [comp2PasteInput, setComp2PasteInput] = useState<string>('');
  const [showComp2QuickInput, setShowComp2QuickInput] = useState<boolean>(true);
  const [comp2ParseError, setComp2ParseError] = useState<string>('');
  const [comp2Data, setComp2Data] = useState({
    acres: '',
    squareFeet: '',
    salePrice: '',
    appraisalValue: '',
    address: '',
    debrisLevel: '',
    slope: '',
    trees: '',
    needsWell: '',
    needsSeptic: '',
    floodZone: '' as FloodZoneValues | '',
    dom: '',
    pricePerSqFt: '',
    pricePerAcre: '',
    closeDate: ''
  });

  // Comp 3 states
  const [comp3PasteInput, setComp3PasteInput] = useState<string>('');
  const [showComp3QuickInput, setShowComp3QuickInput] = useState<boolean>(true);
  const [comp3ParseError, setComp3ParseError] = useState<string>('');
  const [comp3Data, setComp3Data] = useState({
    acres: '',
    squareFeet: '',
    salePrice: '',
    appraisalValue: '',
    address: '',
    debrisLevel: '',
    slope: '',
    trees: '',
    needsWell: '',
    needsSeptic: '',
    floodZone: '' as FloodZoneValues | '',
    dom: '',
    pricePerSqFt: '',
    pricePerAcre: '',
    closeDate: ''
  });

  // Active Listing states
  const [activeListingPasteInput, setActiveListingPasteInput] = useState<string>('');
  const [showActiveListingQuickInput, setShowActiveListingQuickInput] = useState<boolean>(true);
  const [activeListingParseError, setActiveListingParseError] = useState<string>('');
  const [activeListingData, setActiveListingData] = useState({
    acres: '',
    squareFeet: '',
    listPrice: '',
    address: '',
    debrisLevel: '',
    slope: '',
    trees: '',
    needsWell: '',
    needsSeptic: '',
    floodZone: '' as FloodZoneValues | '',
    dom: '',
    pricePerSqFt: '',
    pricePerAcre: '',
    listDate: '',
    status: 'Active',
    daysOnMarket: ''
  });

  // Handle acres to square feet conversion
  const handleAcresChange = (value: string) => {
    setAcres(value);
    if (value && !isNaN(parseFloat(value))) {
      const sqft = (parseFloat(value) * SQUARE_FEET_PER_ACRE).toFixed(0);
      setSquareFeet(sqft);
    } else {
      setSquareFeet('');
    }
  };

  // Handle square feet to acres conversion
  const handleSquareFeetChange = (value: string) => {
    setSquareFeet(value);
    if (value && !isNaN(parseFloat(value))) {
      const acreage = (parseFloat(value) / SQUARE_FEET_PER_ACRE).toFixed(4);
      setAcres(acreage);
    } else {
      setAcres('');
    }
  };

  const calculateValue = () => {
    const numAcres = parseFloat(acres);
    const numBaseValue = parseFloat(baseValue);
    
    let sitePrepCost = 0;
    
    // Site prep costs
    if (debrisLevel === 'heavy') sitePrepCost += 5000;
    if (slope === 'moderate') sitePrepCost += 3000;
    if (slope === 'steep') sitePrepCost += 7000;
    if (trees === 'heavy') sitePrepCost += 8000;
    if (trees === 'moderate') sitePrepCost += 4000;
    if (needsWell === 'true') sitePrepCost += 15000;
    if (needsSeptic === 'true') sitePrepCost += 8000;
    
    // Value adjustments
    let adjustedValue = numBaseValue;
    
    // Flood zone adjustments
    switch (floodZone) {
      case FLOOD_ZONES.HUNDRED_YEAR:
        adjustedValue *= 0.85;
        break;
      case FLOOD_ZONES.HUNDRED_YEAR_WAY:
        adjustedValue *= 0.70;
        break;
      case FLOOD_ZONES.FIVE_HUNDRED_YEAR:
        adjustedValue *= 0.90;
        break;
      case FLOOD_ZONES.COASTAL_HUNDRED_YEAR:
        adjustedValue *= 0.80;
        break;
      case FLOOD_ZONES.COASTAL_HUNDRED_YEAR_WAY:
        adjustedValue *= 0.65;
        break;
      case FLOOD_ZONES.UNDETERMINED:
        adjustedValue *= 0.95;
        break;
      // No adjustment for CLEAR
    }
    
    const finalValue = Math.max(0, adjustedValue - sitePrepCost);
    const valuePerAcre = numAcres ? finalValue / numAcres : 0;
    const totalImpact = finalValue - numBaseValue;
    const impactPercentage = (totalImpact / numBaseValue) * 100;

    setResult({
      totalAcres: numAcres,
      baseValue: numBaseValue,
      sitePrepCost,
      adjustedValue,
      finalValue,
      valuePerAcre,
      totalImpact,
      impactPercentage,
    });
  };

  const parseInputData = () => {
    try {
      setParseError('');
      const lines = pasteInput.split('\n');
      
      let newAcres = '';
      let newSquareFeet = '';
      let newBaseValue = '';
      let newAppraisalValue = '';
      let newAddress = '';
      let newDebrisLevel = '';
      let newSlope = '';
      let newTrees = '';
      let hasWell = false;
      let hasSeptic = false;
      let newFloodZone = '';

      lines.forEach(line => {
        const lowerLine = line.toLowerCase();
        
        // Look for address
        if (lowerLine.includes('address:') || lowerLine.includes('located at') || lowerLine.includes('property address')) {
          const addressMatch = line.match(/(?:address:|located at|property address:?)\s*(.+)/i);
          if (addressMatch) {
            newAddress = addressMatch[1].trim();
          }
        } else if (!newAddress && /^\d+\s+\w+/.test(line)) {
          // If line starts with numbers followed by text, it might be an address
          newAddress = line.trim();
        }

        // Look for square footage
        if (lowerLine.includes('sq ft') || lowerLine.includes('sqft') || lowerLine.includes('square feet') || lowerLine.includes('square foot')) {
          const sqftMatch = line.match(/(\d+[,\d]*\.?\d*)\s*(sq\.?\s*ft\.?|sqft|square\s*feet?)/i);
          if (sqftMatch) {
            newSquareFeet = sqftMatch[1].replace(/,/g, '');
            // Convert to acres
            const acreage = (parseFloat(newSquareFeet) / SQUARE_FEET_PER_ACRE).toFixed(4);
            newAcres = acreage;
          }
        }
        // Look for acreage if square footage wasn't found
        else if (lowerLine.includes('acre') && !newAcres) {
          const acreMatch = line.match(/(\d+\.?\d*)\s*acre/i);
          if (acreMatch) {
            newAcres = acreMatch[1];
            // Convert to square feet
            const sqft = (parseFloat(newAcres) * SQUARE_FEET_PER_ACRE).toFixed(0);
            newSquareFeet = sqft;
          }
        }

        // Look for price/value
        if (lowerLine.includes('price') || lowerLine.includes('value') || lowerLine.includes('$')) {
          const priceMatch = line.match(/\$?\s*([\d,]+)/);
          if (priceMatch) {
            newBaseValue = priceMatch[1].replace(/,/g, '');
          }
        }

        // Look for appraisal value
        if (lowerLine.includes('apprais') || lowerLine.includes('county value')) {
          const appraisalMatch = line.match(/\$?\s*([\d,]+)/);
          if (appraisalMatch) {
            newAppraisalValue = appraisalMatch[1].replace(/,/g, '');
          }
        }

        // Look for conditions
        if (lowerLine.includes('debris') || lowerLine.includes('trash')) {
          if (lowerLine.includes('heavy')) newDebrisLevel = 'heavy';
          else if (lowerLine.includes('moderate')) newDebrisLevel = 'moderate';
        }

        if (lowerLine.includes('slope') || lowerLine.includes('terrain')) {
          if (lowerLine.includes('steep')) newSlope = 'steep';
          else if (lowerLine.includes('moderate')) newSlope = 'moderate';
        }

        if (lowerLine.includes('tree') || lowerLine.includes('forest')) {
          if (lowerLine.includes('heavy')) newTrees = 'heavy';
          else if (lowerLine.includes('moderate')) newTrees = 'moderate';
        }

        // Look for well information
        if (lowerLine.includes('well needed') || lowerLine.includes('no water')) {
          hasWell = true;
        }

        // Look for septic information
        if (lowerLine.includes('septic') || lowerLine.includes('sewage')) {
          hasSeptic = true;
        }

        // Look for flood zone
        if (lowerLine.includes('flood')) {
          if (lowerLine.includes('coastal') && lowerLine.includes('way')) {
            newFloodZone = FLOOD_ZONES.COASTAL_HUNDRED_YEAR_WAY;
          } else if (lowerLine.includes('coastal')) {
            newFloodZone = FLOOD_ZONES.COASTAL_HUNDRED_YEAR;
          } else if (lowerLine.includes('500')) {
            newFloodZone = FLOOD_ZONES.FIVE_HUNDRED_YEAR;
          } else if (lowerLine.includes('way')) {
            newFloodZone = FLOOD_ZONES.HUNDRED_YEAR_WAY;
          } else {
            newFloodZone = FLOOD_ZONES.HUNDRED_YEAR;
          }
        }
      });

      // Update state with parsed values
      if (newSquareFeet) setSquareFeet(newSquareFeet);
      if (newAcres) setAcres(newAcres);
      if (newBaseValue) setBaseValue(newBaseValue);
      if (newAppraisalValue) setAppraisalValue(newAppraisalValue);
      if (newAddress) setAddress(newAddress);
      setDebrisLevel(newDebrisLevel);
      setSlope(newSlope);
      setTrees(newTrees);
      setNeedsWell(hasWell ? 'true' : 'false');
      setNeedsSeptic(hasSeptic ? 'true' : 'false');
      setFloodZone(newFloodZone as FloodZoneValues);

      // Clear paste input and hide quick input section
      setPasteInput('');
      setShowQuickInput(false);
    } catch (error) {
      setParseError('Could not parse the input data. Please check the format and try again.');
    }
  };

  const parseComp1InputData = () => {
    try {
      setComp1ParseError('');
      const lines = comp1PasteInput.split('\n');
      
      const newData = {
        acres: '',
        squareFeet: '',
        salePrice: '',
        appraisalValue: '',
        address: '',
        debrisLevel: '',
        slope: '',
        trees: '',
        needsWell: '',
        needsSeptic: '',
        floodZone: '' as FloodZoneValues | '',
        dom: '',
        pricePerSqFt: '',
        pricePerAcre: '',
        closeDate: ''
      };

      // Helper function to extract value after colon
      const extractValue = (line: string) => {
        const parts = line.split(':');
        return parts.length > 1 ? parts[1].trim() : '';
      };

      // First pass - look for the main property address
      let foundAddress = false;
      for (let i = 0; i < Math.min(20, lines.length); i++) {
        const line = lines[i].trim();
        
        // Skip empty lines
        if (!line) continue;

        // Check for standard MLS address format (street, city, state, zip)
        const mlsAddressRegex = /^(\d+\s+[^,]+),\s*([^,]+),\s*([^,]+),\s*(\d{5}(?:-\d{4})?)/;
        const mlsMatch = line.match(mlsAddressRegex);
        
        if (mlsMatch && !line.toLowerCase().includes('agent') && !line.toLowerCase().includes('office')) {
          newData.address = line.split(' County')[0].trim(); // Remove county if present
          foundAddress = true;
          break;
        }
        
        // Fallback to labeled address fields
        if (line.includes('Address:') && !line.toLowerCase().includes('office') && !line.toLowerCase().includes('agent')) {
          newData.address = extractValue(line);
          foundAddress = true;
          break;
        }
      }

      // If no address found in standard format, try alternative formats
      if (!foundAddress) {
        for (let i = 0; i < Math.min(20, lines.length); i++) {
          const line = lines[i].trim();
          
          // Look for lines that start with numbers and have common street suffixes
          const streetRegex = /^\d+\s+[^,]+(?:Street|St|Avenue|Ave|Road|Rd|Lane|Ln|Drive|Dr|Way|Court|Ct|Circle|Cir|Boulevard|Blvd|Highway|Hwy)/i;
          if (streetRegex.test(line)) {
            newData.address = line.split(' County')[0].trim();
            break;
          }
        }
      }

      // Second pass - process all other fields
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const lowerLine = line.toLowerCase();

        // Skip address processing since we handled it in first pass
        if (line.includes('Address:')) {
          continue;
        }

        // Look for lot size and acreage
        const sqftRegex = /Lot Size:\s*(\d{1,3}(?:,\d{3})*|\d+)\s*\/?\s*(?:Survey)?/i;
        const acreRegex = /Acres:\s*\.?(\d+\.\d+|\.\d+|\d+)/i;

        const sqftMatch = lowerLine.match(sqftRegex);
        if (sqftMatch) {
          const sqft = sqftMatch[1].replace(/,/g, '');
          newData.squareFeet = sqft;
          // Calculate acres with full precision
          const calculatedAcres = (parseFloat(sqft) / SQUARE_FEET_PER_ACRE).toFixed(4);
          if (!newData.acres) { // Only set if not already set
            newData.acres = calculatedAcres;
          }
        }

        const acreMatch = lowerLine.match(acreRegex);
        if (acreMatch) {
          // Handle the case where the number starts with a decimal point
          let acres = acreMatch[1];
          if (!acres.includes('.')) {
            acres = '0.' + acres;
          }
          newData.acres = acres;
          
          // Calculate square feet if not already set
          if (!newData.squareFeet) {
            const calculatedSqFt = Math.round(parseFloat(acres) * SQUARE_FEET_PER_ACRE).toString();
            newData.squareFeet = calculatedSqFt;
          }
        }

        // DOM (Days on Market)
        if (lowerLine.includes('dom:')) {
          const domMatch = line.match(/DOM:\s*(\d+)/i);
          if (domMatch) {
            newData.dom = domMatch[1];
          }
        }

        // Sale Price
        if (lowerLine.includes('sale price:')) {
          const priceMatch = line.match(/Sale Price:\s*\$?(\d{1,3}(?:,\d{3})*|\d+)/i);
          if (priceMatch) {
            newData.salePrice = priceMatch[1].replace(/,/g, '');
          }
        }

        // Price per Square Foot (SP/SF)
        if (lowerLine.includes('sp/sf:')) {
          const spsfMatch = line.match(/SP\/SF:\s*\$?(\d+\.?\d*)/i);
          if (spsfMatch) {
            newData.pricePerSqFt = spsfMatch[1];
          }
        }

        // Price per Acre (SP/ACR)
        if (lowerLine.includes('sp/acr:')) {
          const spacrMatch = line.match(/SP\/ACR:\s*\$?(\d{1,3}(?:,\d{3})*|\d+\.?\d*)/i);
          if (spacrMatch) {
            newData.pricePerAcre = spacrMatch[1].replace(/,/g, '');
          }
        }

        // Close Date
        if (lowerLine.includes('close date:')) {
          const dateMatch = line.match(/Close Date:\s*(\d{2}\/\d{2}\/\d{4})/i);
          if (dateMatch) {
            const [month, day, year] = dateMatch[1].split('/');
            newData.closeDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          }
        }

        // Look for flood zone information in the entire text
        if (lowerLine.includes('flood')) {
          if (lowerLine.includes('coastal') && lowerLine.includes('way')) {
            newData.floodZone = FLOOD_ZONES.COASTAL_HUNDRED_YEAR_WAY;
          } else if (lowerLine.includes('coastal')) {
            newData.floodZone = FLOOD_ZONES.COASTAL_HUNDRED_YEAR;
          } else if (lowerLine.includes('500')) {
            newData.floodZone = FLOOD_ZONES.FIVE_HUNDRED_YEAR;
          } else if (lowerLine.includes('way')) {
            newData.floodZone = FLOOD_ZONES.HUNDRED_YEAR_WAY;
          } else if (lowerLine.includes('100')) {
            newData.floodZone = FLOOD_ZONES.HUNDRED_YEAR;
          } else if (lowerLine.includes('clear')) {
            newData.floodZone = FLOOD_ZONES.CLEAR;
          } else {
            newData.floodZone = FLOOD_ZONES.UNDETERMINED;
          }
        }
      }

      // Update state with parsed values
      setComp1Data(newData);

      // Clear paste input and hide quick input section
      setComp1PasteInput('');
      setShowComp1QuickInput(false);
    } catch (error) {
      setComp1ParseError('Could not parse the input data. Please check the format and try again.');
    }
  };

  const parseComp2InputData = () => {
    try {
      setComp2ParseError('');
      const lines = comp2PasteInput.split('\n');
      
      const newData = {
        acres: '',
        squareFeet: '',
        salePrice: '',
        appraisalValue: '',
        address: '',
        debrisLevel: '',
        slope: '',
        trees: '',
        needsWell: '',
        needsSeptic: '',
        floodZone: '' as FloodZoneValues | '',
        dom: '',
        pricePerSqFt: '',
        pricePerAcre: '',
        closeDate: ''
      };

      // Helper function to extract value after colon
      const extractValue = (line: string) => {
        const parts = line.split(':');
        return parts.length > 1 ? parts[1].trim() : '';
      };

      // First pass - look for the main property address
      let foundAddress = false;
      for (let i = 0; i < Math.min(20, lines.length); i++) {
        const line = lines[i].trim();
        
        // Skip empty lines
        if (!line) continue;

        // Check for standard MLS address format (street, city, state, zip)
        const mlsAddressRegex = /^(\d+\s+[^,]+),\s*([^,]+),\s*([^,]+),\s*(\d{5}(?:-\d{4})?)/;
        const mlsMatch = line.match(mlsAddressRegex);
        
        if (mlsMatch && !line.toLowerCase().includes('agent') && !line.toLowerCase().includes('office')) {
          newData.address = line.split(' County')[0].trim(); // Remove county if present
          foundAddress = true;
          break;
        }
        
        // Fallback to labeled address fields
        if (line.includes('Address:') && !line.toLowerCase().includes('office') && !line.toLowerCase().includes('agent')) {
          newData.address = extractValue(line);
          foundAddress = true;
          break;
        }
      }

      // If no address found in standard format, try alternative formats
      if (!foundAddress) {
        for (let i = 0; i < Math.min(20, lines.length); i++) {
          const line = lines[i].trim();
          
          // Look for lines that start with numbers and have common street suffixes
          const streetRegex = /^\d+\s+[^,]+(?:Street|St|Avenue|Ave|Road|Rd|Lane|Ln|Drive|Dr|Way|Court|Ct|Circle|Cir|Boulevard|Blvd|Highway|Hwy)/i;
          if (streetRegex.test(line)) {
            newData.address = line.split(' County')[0].trim();
            break;
          }
        }
      }

      // Second pass - process all other fields
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const lowerLine = line.toLowerCase();

        // Skip address processing since we handled it in first pass
        if (line.includes('Address:')) {
          continue;
        }

        // Look for lot size and acreage
        const sqftRegex = /Lot Size:\s*(\d{1,3}(?:,\d{3})*|\d+)\s*\/?\s*(?:Survey)?/i;
        const acreRegex = /Acres:\s*\.?(\d+\.\d+|\.\d+|\d+)/i;

        const sqftMatch = lowerLine.match(sqftRegex);
        if (sqftMatch) {
          const sqft = sqftMatch[1].replace(/,/g, '');
          newData.squareFeet = sqft;
          // Calculate acres with full precision
          const calculatedAcres = (parseFloat(sqft) / SQUARE_FEET_PER_ACRE).toFixed(4);
          if (!newData.acres) { // Only set if not already set
            newData.acres = calculatedAcres;
          }
        }

        const acreMatch = lowerLine.match(acreRegex);
        if (acreMatch) {
          // Handle the case where the number starts with a decimal point
          let acres = acreMatch[1];
          if (!acres.includes('.')) {
            acres = '0.' + acres;
          }
          newData.acres = acres;
          
          // Calculate square feet if not already set
          if (!newData.squareFeet) {
            const calculatedSqFt = Math.round(parseFloat(acres) * SQUARE_FEET_PER_ACRE).toString();
            newData.squareFeet = calculatedSqFt;
          }
        }

        // DOM (Days on Market)
        if (lowerLine.includes('dom:')) {
          const domMatch = line.match(/DOM:\s*(\d+)/i);
          if (domMatch) {
            newData.dom = domMatch[1];
          }
        }

        // Sale Price
        if (lowerLine.includes('sale price:')) {
          const priceMatch = line.match(/Sale Price:\s*\$?(\d{1,3}(?:,\d{3})*|\d+)/i);
          if (priceMatch) {
            newData.salePrice = priceMatch[1].replace(/,/g, '');
          }
        }

        // Price per Square Foot (SP/SF)
        if (lowerLine.includes('sp/sf:')) {
          const spsfMatch = line.match(/SP\/SF:\s*\$?(\d+\.?\d*)/i);
          if (spsfMatch) {
            newData.pricePerSqFt = spsfMatch[1];
          }
        }

        // Price per Acre (SP/ACR)
        if (lowerLine.includes('sp/acr:')) {
          const spacrMatch = line.match(/SP\/ACR:\s*\$?(\d{1,3}(?:,\d{3})*|\d+\.?\d*)/i);
          if (spacrMatch) {
            newData.pricePerAcre = spacrMatch[1].replace(/,/g, '');
          }
        }

        // Close Date
        if (lowerLine.includes('close date:')) {
          const dateMatch = line.match(/Close Date:\s*(\d{2}\/\d{2}\/\d{4})/i);
          if (dateMatch) {
            const [month, day, year] = dateMatch[1].split('/');
            newData.closeDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          }
        }

        // Look for flood zone information in the entire text
        if (lowerLine.includes('flood')) {
          if (lowerLine.includes('coastal') && lowerLine.includes('way')) {
            newData.floodZone = FLOOD_ZONES.COASTAL_HUNDRED_YEAR_WAY;
          } else if (lowerLine.includes('coastal')) {
            newData.floodZone = FLOOD_ZONES.COASTAL_HUNDRED_YEAR;
          } else if (lowerLine.includes('500')) {
            newData.floodZone = FLOOD_ZONES.FIVE_HUNDRED_YEAR;
          } else if (lowerLine.includes('way')) {
            newData.floodZone = FLOOD_ZONES.HUNDRED_YEAR_WAY;
          } else if (lowerLine.includes('100')) {
            newData.floodZone = FLOOD_ZONES.HUNDRED_YEAR;
          } else if (lowerLine.includes('clear')) {
            newData.floodZone = FLOOD_ZONES.CLEAR;
          } else {
            newData.floodZone = FLOOD_ZONES.UNDETERMINED;
          }
        }
      }

      // Update state with parsed values
      setComp2Data(newData);

      // Clear paste input and hide quick input section
      setComp2PasteInput('');
      setShowComp2QuickInput(false);
    } catch (error) {
      setComp2ParseError('Could not parse the input data. Please check the format and try again.');
    }
  };

  const parseComp3InputData = () => {
    try {
      setComp3ParseError('');
      const lines = comp3PasteInput.split('\n');
      
      const newData = {
        acres: '',
        squareFeet: '',
        salePrice: '',
        appraisalValue: '',
        address: '',
        debrisLevel: '',
        slope: '',
        trees: '',
        needsWell: '',
        needsSeptic: '',
        floodZone: '' as FloodZoneValues | '',
        dom: '',
        pricePerSqFt: '',
        pricePerAcre: '',
        closeDate: ''
      };

      // Helper function to extract value after colon
      const extractValue = (line: string) => {
        const parts = line.split(':');
        return parts.length > 1 ? parts[1].trim() : '';
      };

      // First pass - look for the main property address
      let foundAddress = false;
      for (let i = 0; i < Math.min(20, lines.length); i++) {
        const line = lines[i].trim();
        
        // Skip empty lines
        if (!line) continue;

        // Check for standard MLS address format (street, city, state, zip)
        const mlsAddressRegex = /^(\d+\s+[^,]+),\s*([^,]+),\s*([^,]+),\s*(\d{5}(?:-\d{4})?)/;
        const mlsMatch = line.match(mlsAddressRegex);
        
        if (mlsMatch && !line.toLowerCase().includes('agent') && !line.toLowerCase().includes('office')) {
          newData.address = line.split(' County')[0].trim(); // Remove county if present
          foundAddress = true;
          break;
        }
        
        // Fallback to labeled address fields
        if (line.includes('Address:') && !line.toLowerCase().includes('office') && !line.toLowerCase().includes('agent')) {
          newData.address = extractValue(line);
          foundAddress = true;
          break;
        }
      }

      // If no address found in standard format, try alternative formats
      if (!foundAddress) {
        for (let i = 0; i < Math.min(20, lines.length); i++) {
          const line = lines[i].trim();
          
          // Look for lines that start with numbers and have common street suffixes
          const streetRegex = /^\d+\s+[^,]+(?:Street|St|Avenue|Ave|Road|Rd|Lane|Ln|Drive|Dr|Way|Court|Ct|Circle|Cir|Boulevard|Blvd|Highway|Hwy)/i;
          if (streetRegex.test(line)) {
            newData.address = line.split(' County')[0].trim();
            break;
          }
        }
      }

      // Second pass - process all other fields
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const lowerLine = line.toLowerCase();

        // Look for lot size and acreage
        const sqftRegex = /Lot Size:\s*(\d{1,3}(?:,\d{3})*|\d+)\s*\/?\s*(?:Survey)?/i;
        const acreRegex = /Acres:\s*\.?(\d+\.\d+|\.\d+|\d+)/i;

        const sqftMatch = lowerLine.match(sqftRegex);
        if (sqftMatch) {
          const sqft = sqftMatch[1].replace(/,/g, '');
          newData.squareFeet = sqft;
          // Calculate acres with full precision
          const calculatedAcres = (parseFloat(sqft) / SQUARE_FEET_PER_ACRE).toFixed(4);
          if (!newData.acres) { // Only set if not already set
            newData.acres = calculatedAcres;
          }
        }

        const acreMatch = lowerLine.match(acreRegex);
        if (acreMatch) {
          // Handle the case where the number starts with a decimal point
          let acres = acreMatch[1];
          if (!acres.includes('.')) {
            acres = '0.' + acres;
          }
          newData.acres = acres;
          
          // Calculate square feet if not already set
          if (!newData.squareFeet) {
            const calculatedSqFt = Math.round(parseFloat(acres) * SQUARE_FEET_PER_ACRE).toString();
            newData.squareFeet = calculatedSqFt;
          }
        }

        // DOM (Days on Market)
        if (lowerLine.includes('dom:')) {
          const domMatch = line.match(/DOM:\s*(\d+)/i);
          if (domMatch) {
            newData.dom = domMatch[1];
          }
        }

        // Sale Price
        if (lowerLine.includes('sale price:')) {
          const priceMatch = line.match(/Sale Price:\s*\$?(\d{1,3}(?:,\d{3})*|\d+)/i);
          if (priceMatch) {
            newData.salePrice = priceMatch[1].replace(/,/g, '');
          }
        }

        // Price per Square Foot (SP/SF)
        if (lowerLine.includes('sp/sf:')) {
          const spsfMatch = line.match(/SP\/SF:\s*\$?(\d+\.?\d*)/i);
          if (spsfMatch) {
            newData.pricePerSqFt = spsfMatch[1];
          }
        }

        // Price per Acre (SP/ACR)
        if (lowerLine.includes('sp/acr:')) {
          const spacrMatch = line.match(/SP\/ACR:\s*\$?(\d{1,3}(?:,\d{3})*|\d+\.?\d*)/i);
          if (spacrMatch) {
            newData.pricePerAcre = spacrMatch[1].replace(/,/g, '');
          }
        }

        // Close Date
        if (lowerLine.includes('close date:')) {
          const dateMatch = line.match(/Close Date:\s*(\d{2}\/\d{2}\/\d{4})/i);
          if (dateMatch) {
            const [month, day, year] = dateMatch[1].split('/');
            newData.closeDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          }
        }

        // Look for flood zone information in the entire text
        if (lowerLine.includes('flood')) {
          if (lowerLine.includes('coastal') && lowerLine.includes('way')) {
            newData.floodZone = FLOOD_ZONES.COASTAL_HUNDRED_YEAR_WAY;
          } else if (lowerLine.includes('coastal')) {
            newData.floodZone = FLOOD_ZONES.COASTAL_HUNDRED_YEAR;
          } else if (lowerLine.includes('500')) {
            newData.floodZone = FLOOD_ZONES.FIVE_HUNDRED_YEAR;
          } else if (lowerLine.includes('way')) {
            newData.floodZone = FLOOD_ZONES.HUNDRED_YEAR_WAY;
          } else if (lowerLine.includes('100')) {
            newData.floodZone = FLOOD_ZONES.HUNDRED_YEAR;
          } else if (lowerLine.includes('clear')) {
            newData.floodZone = FLOOD_ZONES.CLEAR;
          } else {
            newData.floodZone = FLOOD_ZONES.UNDETERMINED;
          }
        }
      }

      // Update state with parsed values
      setComp3Data(newData);

      // Clear paste input and hide quick input section
      setComp3PasteInput('');
      setShowComp3QuickInput(false);
    } catch (error) {
      setComp3ParseError('Could not parse the input data. Please check the format and try again.');
    }
  };

  const parseActiveListingInputData = () => {
    try {
      setActiveListingParseError('');
      const lines = activeListingPasteInput.split('\n');
      
      const newData = {
        acres: '',
        squareFeet: '',
        listPrice: '',
        address: '',
        debrisLevel: '',
        slope: '',
        trees: '',
        needsWell: '',
        needsSeptic: '',
        floodZone: '' as FloodZoneValues | '',
        dom: '',
        pricePerSqFt: '',
        pricePerAcre: '',
        listDate: '',
        status: 'Active',
        daysOnMarket: ''
      };

      // Helper function to extract value after colon
      const extractValue = (line: string) => {
        const parts = line.split(':');
        return parts.length > 1 ? parts[1].trim() : '';
      };

      // Helper function to extract price from various formats
      const extractPrice = (line: string) => {
        // Look for various price formats: $1,234,567 or $1234567 or 1234567
        const priceMatch = line.match(/\$?\s*([\d,]+(?:\.\d{2})?)/);
        return priceMatch ? priceMatch[1].replace(/,/g, '') : '';
      };

      // Helper function to extract numbers from text
      const extractNumber = (line: string) => {
        const numberMatch = line.match(/(\d+(?:\.\d+)?)/);
        return numberMatch ? numberMatch[1] : '';
      };

      // First pass - look for the main property address
      let foundAddress = false;
      for (let i = 0; i < Math.min(20, lines.length); i++) {
        const line = lines[i].trim();
        
        // Skip empty lines
        if (!line) continue;

        // Check for standard MLS address format (street, city, state, zip)
        const mlsAddressRegex = /^(\d+\s+[^,]+),\s*([^,]+),\s*([^,]+),\s*(\d{5}(?:-\d{4})?)/;
        const mlsMatch = line.match(mlsAddressRegex);
        
        if (mlsMatch && !line.toLowerCase().includes('agent') && !line.toLowerCase().includes('office')) {
          newData.address = line.split(' County')[0].trim(); // Remove county if present
          foundAddress = true;
          break;
        }
        
        // Fallback to labeled address fields
        if (line.includes('Address:') && !line.toLowerCase().includes('office') && !line.toLowerCase().includes('agent')) {
          newData.address = extractValue(line);
          foundAddress = true;
          break;
        }
      }

      // If no address found in standard format, try alternative formats
      if (!foundAddress) {
        for (let i = 0; i < Math.min(20, lines.length); i++) {
          const line = lines[i].trim();
          
          // Look for lines that start with numbers and have common street suffixes
          const streetRegex = /^\d+\s+[^,]+(?:Street|St|Avenue|Ave|Road|Rd|Lane|Ln|Drive|Dr|Way|Court|Ct|Circle|Cir|Boulevard|Blvd|Highway|Hwy)/i;
          if (streetRegex.test(line)) {
            newData.address = line.split(' County')[0].trim();
            break;
          }
        }
      }

      // Additional address parsing for MLS format
      if (!foundAddress) {
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.includes('Address:') && !line.includes('List Agent:')) {
            const addressMatch = line.match(/Address:\s*(.+)/);
            if (addressMatch) {
              newData.address = addressMatch[1].trim();
              foundAddress = true;
              break;
            }
          }
        }
      }

      // Second pass - process all other fields with enhanced parsing
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const lowerLine = line.toLowerCase();

        // Skip address processing since we handled it in first pass
        if (line.includes('Address:')) {
          continue;
        }

              // Enhanced List Price parsing - multiple formats
      if (!newData.listPrice) {
        // Handle MLS format: "List Price: $135,000" - HIGHEST PRIORITY
        if (line.includes('List Price:') && line.includes('$')) {
          console.log('Found List Price line:', line);
          // Try multiple regex patterns to handle different separators
          let priceMatch = line.match(/List Price:\s*\$?([\d,]+)/);
          if (!priceMatch) {
            priceMatch = line.match(/List Price:\t\$?([\d,]+)/);
          }
          if (!priceMatch) {
            priceMatch = line.match(/List Price:\s*\t\s*\$?([\d,]+)/);
          }
          if (priceMatch) {
            console.log('List Price match:', priceMatch[1]);
            newData.listPrice = priceMatch[1].replace(/,/g, '');
          }
        }
        // Handle other formats
        else if (lowerLine.includes('list price:') || lowerLine.includes('asking price:') || lowerLine.includes('price:')) {
          newData.listPrice = extractPrice(line);
        } else if (lowerLine.includes('list price') || lowerLine.includes('asking price')) {
          newData.listPrice = extractPrice(line);
        } else if (lowerLine.includes('$') && (lowerLine.includes('price') || lowerLine.includes('list'))) {
          newData.listPrice = extractPrice(line);
        } else if (/\$\d{1,3}(?:,\d{3})*/.test(line)) {
          // If line contains a dollar amount with commas, it might be the price
          newData.listPrice = extractPrice(line);
        }
      }

        // Enhanced Acreage parsing - PRIORITIZE THIS OVER SQUARE FOOTAGE
        if (!newData.acres) {
          // Handle MLS format: "Acres: 1.9170" - HIGHEST PRIORITY
          if (line.includes('Acres:') && !line.includes('LP/Acre:')) {
            const acreMatch = line.match(/Acres:\s*(\d+\.?\d*)/);
            if (acreMatch) {
              newData.acres = acreMatch[1];
              // Convert to square feet
              const sqft = (parseFloat(newData.acres) * SQUARE_FEET_PER_ACRE).toFixed(0);
              newData.squareFeet = sqft;
            }
          } else if (lowerLine.includes('acre:') || lowerLine.includes('acres:')) {
            const acreMatch = line.match(/(\d+\.?\d*)/);
            if (acreMatch) {
              newData.acres = acreMatch[1];
              // Convert to square feet
              const sqft = (parseFloat(newData.acres) * SQUARE_FEET_PER_ACRE).toFixed(0);
              newData.squareFeet = sqft;
            }
          } else if (lowerLine.includes('acre') || lowerLine.includes('acres')) {
            const acreMatch = line.match(/(\d+\.?\d*)\s*acre/i);
            if (acreMatch) {
              newData.acres = acreMatch[1];
              // Convert to square feet
              const sqft = (parseFloat(newData.acres) * SQUARE_FEET_PER_ACRE).toFixed(0);
              newData.squareFeet = sqft;
            }
          }
        }

        // Enhanced Square Footage parsing - ONLY IF ACRES NOT FOUND
        if (!newData.squareFeet && !newData.acres) {
          // Handle MLS format: "Lot Size: 83,505 / Appr Dist"
          if (line.includes('Lot Size:') && line.includes('/')) {
            const lotSizeMatch = line.match(/Lot Size:\s*([\d,]+)/);
            if (lotSizeMatch) {
              newData.squareFeet = lotSizeMatch[1].replace(/,/g, '');
              // Convert to acres
              const acreage = (parseFloat(newData.squareFeet) / SQUARE_FEET_PER_ACRE).toFixed(4);
              newData.acres = acreage;
            }
          } else if (lowerLine.includes('sq ft:') || lowerLine.includes('sqft:') || lowerLine.includes('square feet:')) {
            const sqftMatch = line.match(/(\d+[,\d]*\.?\d*)/);
            if (sqftMatch) {
              newData.squareFeet = sqftMatch[1].replace(/,/g, '');
              // Convert to acres
              const acreage = (parseFloat(newData.squareFeet) / SQUARE_FEET_PER_ACRE).toFixed(4);
              newData.acres = acreage;
            }
          } else if (lowerLine.includes('sq ft') || lowerLine.includes('sqft') || lowerLine.includes('square feet')) {
            const sqftMatch = line.match(/(\d+[,\d]*\.?\d*)\s*(sq\.?\s*ft\.?|sqft|square\s*feet?)/i);
            if (sqftMatch) {
              newData.squareFeet = sqftMatch[1].replace(/,/g, '');
              // Convert to acres
              const acreage = (parseFloat(newData.squareFeet) / SQUARE_FEET_PER_ACRE).toFixed(4);
              newData.acres = acreage;
            }
          }
        }

        // Enhanced Days on Market parsing
        if (!newData.daysOnMarket) {
          // Handle MLS format: "DOM: 59" (including when on same line as other data)
          if (line.includes('DOM:') && !line.includes('LP/SF:')) {
            const domMatch = line.match(/DOM:\s*(\d+)/);
            if (domMatch) {
              newData.daysOnMarket = domMatch[1];
            }
          }
          // Handle MLS format: "DOM:	59" (with tab separator)
          else if (line.includes('DOM:') && line.includes('\t')) {
            const domMatch = line.match(/DOM:\s*(\d+)/);
            if (domMatch) {
              newData.daysOnMarket = domMatch[1];
            }
          }
          // Handle other DOM formats
          else if (lowerLine.includes('dom:') || lowerLine.includes('days on market:') || lowerLine.includes('days listed:')) {
            const domNumber = extractNumber(line);
            if (domNumber) {
              newData.daysOnMarket = domNumber;
            }
          } else if (lowerLine.includes('dom') || lowerLine.includes('days on market') || lowerLine.includes('days listed')) {
            const domNumber = extractNumber(line);
            if (domNumber) {
              newData.daysOnMarket = domNumber;
            }
          }
        }

        // Enhanced List Date parsing
        if (!newData.listDate) {
          if (lowerLine.includes('list date:') || lowerLine.includes('listed:') || lowerLine.includes('date listed:')) {
            const dateMatch = line.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/);
            if (dateMatch) {
              newData.listDate = dateMatch[1];
            }
          } else if (lowerLine.includes('list date') || lowerLine.includes('listed') || lowerLine.includes('date listed')) {
            const dateMatch = line.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/);
            if (dateMatch) {
              newData.listDate = dateMatch[1];
            }
          }
          // Handle MLS format: "List Date: 07/01/2025"
          else if (line.includes('List Date:') && line.includes('/')) {
            const dateMatch = line.match(/List Date:\s*(\d{1,2}\/\d{1,2}\/\d{2,4})/);
            if (dateMatch) {
              newData.listDate = dateMatch[1];
            }
          }
        }

        // Enhanced Price per Square Foot parsing
        if (!newData.pricePerSqFt) {
          // Handle MLS format: "LP/SF: $1.62" or "LP/SF:	$1.62"
          if (line.includes('LP/SF:')) {
            console.log('Found LP/SF line:', line);
            // Try multiple regex patterns to handle different separators
            let priceMatch = line.match(/LP\/SF:\s*\$?(\d+\.?\d*)/);
            if (!priceMatch) {
              priceMatch = line.match(/LP\/SF:\t\$?(\d+\.?\d*)/);
            }
            if (!priceMatch) {
              priceMatch = line.match(/LP\/SF:\s*\t\s*\$?(\d+\.?\d*)/);
            }
            if (priceMatch) {
              console.log('LP/SF match:', priceMatch[1]);
              newData.pricePerSqFt = priceMatch[1];
            }
          }
          // Handle other formats
          else if (lowerLine.includes('price/sq ft:') || lowerLine.includes('price per sq ft:') || lowerLine.includes('$/sq ft:')) {
            const priceMatch = line.match(/\$?(\d+\.?\d*)/);
            if (priceMatch) {
              newData.pricePerSqFt = priceMatch[1];
            }
          } else if (lowerLine.includes('price/sq ft') || lowerLine.includes('price per sq ft') || lowerLine.includes('$/sq ft')) {
            const priceMatch = line.match(/\$?(\d+\.?\d*)/);
            if (priceMatch) {
              newData.pricePerSqFt = priceMatch[1];
            }
          }
        }

        // Enhanced Price per Acre parsing
        if (!newData.pricePerAcre) {
          // Handle MLS format: "LP/Acre: $70,422.54" or "LP/Acre:	$70,422.54"
          if (line.includes('LP/Acre:')) {
            console.log('Found LP/Acre line:', line);
            const priceMatch = line.match(/LP\/Acre:\s*\$?([\d,]+\.?\d*)/);
            if (priceMatch) {
              console.log('LP/Acre match:', priceMatch[1]);
              newData.pricePerAcre = priceMatch[1].replace(/,/g, '');
            }
          }
          // Handle other formats
          else if (lowerLine.includes('price/acre:') || lowerLine.includes('price per acre:') || lowerLine.includes('$/acre:')) {
            const priceMatch = line.match(/\$?(\d+\.?\d*)/);
            if (priceMatch) {
              newData.pricePerAcre = priceMatch[1];
            }
          } else if (lowerLine.includes('price/acre') || lowerLine.includes('price per acre') || lowerLine.includes('$/acre')) {
            const priceMatch = line.match(/\$?(\d+\.?\d*)/);
            if (priceMatch) {
              newData.pricePerAcre = priceMatch[1];
            }
          }
        }

        // Look for conditions
        if (lowerLine.includes('debris') || lowerLine.includes('trash')) {
          if (lowerLine.includes('heavy')) newData.debrisLevel = 'heavy';
          else if (lowerLine.includes('moderate')) newData.debrisLevel = 'moderate';
        }

        if (lowerLine.includes('slope') || lowerLine.includes('terrain')) {
          if (lowerLine.includes('steep')) newData.slope = 'steep';
          else if (lowerLine.includes('moderate')) newData.slope = 'moderate';
        }

        if (lowerLine.includes('tree') || lowerLine.includes('forest')) {
          if (lowerLine.includes('heavy')) newData.trees = 'heavy';
          else if (lowerLine.includes('moderate')) newData.trees = 'moderate';
        }

        // Look for well information
        if (lowerLine.includes('well needed') || lowerLine.includes('no water')) {
          newData.needsWell = 'true';
        }

        // Look for septic information
        if (lowerLine.includes('septic') || lowerLine.includes('sewage')) {
          newData.needsSeptic = 'true';
        }

        // Look for flood zone
        if (lowerLine.includes('flood')) {
          if (lowerLine.includes('coastal') && lowerLine.includes('way')) {
            newData.floodZone = FLOOD_ZONES.COASTAL_HUNDRED_YEAR_WAY;
          } else if (lowerLine.includes('coastal')) {
            newData.floodZone = FLOOD_ZONES.COASTAL_HUNDRED_YEAR;
          } else if (lowerLine.includes('500')) {
            newData.floodZone = FLOOD_ZONES.FIVE_HUNDRED_YEAR;
          } else if (lowerLine.includes('way')) {
            newData.floodZone = FLOOD_ZONES.HUNDRED_YEAR_WAY;
          } else {
            newData.floodZone = FLOOD_ZONES.HUNDRED_YEAR;
          }
        }
      }

      // Calculate price per acre and square foot if not already set
      if (newData.listPrice && newData.acres && !newData.pricePerAcre) {
        const pricePerAcre = (parseFloat(newData.listPrice) / parseFloat(newData.acres)).toFixed(2);
        newData.pricePerAcre = pricePerAcre;
      }

      if (newData.listPrice && newData.squareFeet && !newData.pricePerSqFt) {
        const pricePerSqFt = (parseFloat(newData.listPrice) / parseFloat(newData.squareFeet)).toFixed(2);
        newData.pricePerSqFt = pricePerSqFt;
      }

      // Debug logging
      console.log('Parsed Active Listing Data:', newData);

      // Update state with parsed values
      setActiveListingData(newData);

      // Clear paste input and hide quick input section
      setActiveListingPasteInput('');
      setShowActiveListingQuickInput(false);
    } catch (error) {
      setActiveListingParseError('Could not parse the input data. Please check the format and try again.');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Land Evaluation Calculator
        </Typography>

        {/* Quick Input Section */}
        <Collapse in={showQuickInput}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <ContentPasteIcon />
              <Typography variant="h6">Subject Property Quick Input</Typography>
              <IconButton
                size="small"
                onClick={() => setShowQuickInput(false)}
                sx={{ ml: 'auto' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Copy and paste property details from your source, and we'll automatically fill in the calculator fields.
            </Typography>
            <TextareaAutosize
              minRows={4}
              placeholder="Paste property details here..."
              value={pasteInput}
              onChange={(e) => setPasteInput(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '8px',
                fontFamily: 'inherit',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
            <Button
              variant="contained"
              onClick={parseInputData}
              disabled={!pasteInput}
              fullWidth
            >
              Parse Data
            </Button>
            {parseError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {parseError}
              </Alert>
            )}
          </Box>
        </Collapse>

        {!showQuickInput && (
          <Button
            variant="outlined"
            startIcon={<ContentPasteIcon />}
            onClick={() => setShowQuickInput(true)}
            sx={{ mb: 3 }}
          >
            Show Subject Property Quick Input
          </Button>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Property Information */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flexGrow: 1, width: '100%' }}>
              <TextField
                fullWidth
                label="Property Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter the property address"
              />
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(50% - 8px)' } }}>
              <TextField
                fullWidth
                label="Number of Acres"
                type="number"
                value={acres}
                onChange={(e) => handleAcresChange(e.target.value)}
                InputProps={{ 
                  inputProps: { min: 0, step: "0.0001" },
                  endAdornment: (
                    <Tooltip title="1 acre = 43,560 square feet">
                      <InfoIcon color="action" sx={{ ml: 1 }} />
                    </Tooltip>
                  )
                }}
              />
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(50% - 8px)' } }}>
              <TextField
                fullWidth
                label="Square Feet"
                type="number"
                value={squareFeet}
                onChange={(e) => handleSquareFeetChange(e.target.value)}
                InputProps={{ 
                  inputProps: { min: 0 },
                  endAdornment: (
                    <Tooltip title="1 acre = 43,560 square feet">
                      <InfoIcon color="action" sx={{ ml: 1 }} />
                    </Tooltip>
                  )
                }}
              />
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(50% - 8px)' } }}>
              <TextField
                fullWidth
                label="Asking Price"
                type="number"
                value={baseValue}
                onChange={(e) => setBaseValue(e.target.value)}
                InputProps={{ 
                  inputProps: { min: 0 },
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                }}
              />
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(50% - 8px)' } }}>
              <TextField
                fullWidth
                label="County Appraisal Value"
                type="number"
                value={appraisalValue}
                onChange={(e) => setAppraisalValue(e.target.value)}
                InputProps={{ 
                  inputProps: { min: 0 },
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                }}
              />
            </Box>
          </Box>

          {/* Site Conditions */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
              <FormControl fullWidth>
                <Select
                  value={debrisLevel}
                  label="Debris Level"
                  onChange={(e) => setDebrisLevel(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">Select debris level</MenuItem>
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="moderate">Moderate</MenuItem>
                  <MenuItem value="heavy">Heavy</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
              <FormControl fullWidth>
                <Select
                  value={slope}
                  label="Slope Condition"
                  onChange={(e) => setSlope(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">Select slope condition</MenuItem>
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="moderate">Moderate</MenuItem>
                  <MenuItem value="steep">Steep</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
              <FormControl fullWidth>
                <Select
                  value={trees}
                  label="Tree Density"
                  onChange={(e) => setTrees(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">Select tree density</MenuItem>
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="moderate">Moderate</MenuItem>
                  <MenuItem value="heavy">Heavy</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Additional Conditions */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
              <FormControl component="fieldset">
                <Typography variant="subtitle2">Needs Water Well</Typography>
                <RadioGroup
                  row
                  value={needsWell}
                  onChange={(e) => setNeedsWell(e.target.value)}
                >
                  <FormControlLabel value="true" control={<Radio />} label="Yes" />
                  <FormControlLabel value="false" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Box>

            <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
              <FormControl component="fieldset">
                <Typography variant="subtitle2">Needs Septic Tank</Typography>
                <RadioGroup
                  row
                  value={needsSeptic}
                  onChange={(e) => setNeedsSeptic(e.target.value)}
                >
                  <FormControlLabel value="true" control={<Radio />} label="Yes" />
                  <FormControlLabel value="false" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Box>

            <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
              <FormControl fullWidth>
                <Select
                  value={floodZone}
                  label="Flood Zone"
                  onChange={(e) => setFloodZone(e.target.value as FloodZoneValues)}
                  displayEmpty
                >
                  <MenuItem value="">Select flood zone</MenuItem>
                  {Object.values(FLOOD_ZONES).map((zone) => (
                    <MenuItem key={zone} value={zone}>
                      {zone}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Calculate Button */}
          <Box sx={{ width: '100%', mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={calculateValue}
              disabled={!acres || !baseValue}
            >
              Calculate Value
            </Button>
          </Box>

          {/* Results Section */}
          {result && (
            <Box sx={{ width: '100%' }}>
              <Box mt={3} p={2} bgcolor="background.paper" borderRadius={1}>
                <Typography variant="h6" gutterBottom>
                  Calculation Results
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(50% - 8px)' } }}>
                    <Typography variant="subtitle2">Property Details</Typography>
                    <Typography>Total Acres: {result.totalAcres.toLocaleString()}</Typography>
                    <Typography>Base Value: ${result.baseValue.toLocaleString()}</Typography>
                  </Box>
                  
                  <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(50% - 8px)' } }}>
                    <Typography variant="subtitle2">Adjustments</Typography>
                    <Typography>Site Preparation Costs: ${result.sitePrepCost.toLocaleString()}</Typography>
                    <Typography>Adjusted Value: ${result.adjustedValue.toLocaleString()}</Typography>
                  </Box>
                  
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle2">Final Values</Typography>
                    <Typography>Final Property Value: ${result.finalValue.toLocaleString()}</Typography>
                    <Typography>Value per Acre: ${result.valuePerAcre.toLocaleString()}</Typography>
                    <Typography color={result.totalImpact >= 0 ? "success.main" : "error.main"}>
                      Total Value Impact: ${result.totalImpact.toLocaleString()} ({result.impactPercentage.toFixed(1)}%)
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        {/* Comp 1 Quick Input Section */}
        <Box sx={{ mt: 4, pt: 4, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom>
            Comparable Properties
          </Typography>
          
          <Collapse in={showComp1QuickInput}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ContentPasteIcon />
                <Typography variant="subtitle1">Comp 1 Quick Input</Typography>
                <IconButton
                  size="small"
                  onClick={() => setShowComp1QuickInput(false)}
                  sx={{ ml: 'auto' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Copy and paste comparable property details, and we'll automatically fill in the fields.
              </Typography>
              <TextareaAutosize
                minRows={4}
                placeholder="Paste comparable property details here..."
                value={comp1PasteInput}
                onChange={(e) => setComp1PasteInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '8px',
                  fontFamily: 'inherit',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
              <Button
                variant="contained"
                onClick={parseComp1InputData}
                disabled={!comp1PasteInput}
                fullWidth
              >
                Parse Comp 1 Data
              </Button>
              {comp1ParseError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {comp1ParseError}
                </Alert>
              )}
            </Box>
          </Collapse>

          {!showComp1QuickInput && (
            <Button
              variant="outlined"
              startIcon={<ContentPasteIcon />}
              onClick={() => setShowComp1QuickInput(true)}
            >
              Show Comp 1 Quick Input
            </Button>
          )}

          {/* Comp 1 Details Form */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
              Comp 1 Details
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flexGrow: 1, width: '100%' }}>
                <TextField
                  fullWidth
                  label="Property Address"
                  value={comp1Data.address}
                  onChange={(e) => setComp1Data({ ...comp1Data, address: e.target.value })}
                  placeholder="Enter the property address"
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Number of Acres"
                  type="number"
                  value={comp1Data.acres}
                  onChange={(e) => {
                    const acres = e.target.value;
                    const sqft = acres ? (parseFloat(acres) * SQUARE_FEET_PER_ACRE).toFixed(0) : '';
                    setComp1Data({ 
                      ...comp1Data, 
                      acres: acres,
                      squareFeet: sqft
                    });
                  }}
                  InputProps={{ 
                    inputProps: { min: 0, step: "0.0001" }
                  }}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Square Feet"
                  type="number"
                  value={comp1Data.squareFeet}
                  onChange={(e) => {
                    const sqft = e.target.value;
                    const acres = sqft ? (parseFloat(sqft) / SQUARE_FEET_PER_ACRE).toFixed(4) : '';
                    setComp1Data({ 
                      ...comp1Data, 
                      squareFeet: sqft,
                      acres: acres
                    });
                  }}
                  InputProps={{ 
                    inputProps: { min: 0 }
                  }}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Days on Market (DOM)"
                  type="number"
                  value={comp1Data.dom || ''}
                  onChange={(e) => setComp1Data({ ...comp1Data, dom: e.target.value })}
                  InputProps={{ 
                    inputProps: { min: 0 }
                  }}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Sale Price"
                  type="number"
                  value={comp1Data.salePrice}
                  onChange={(e) => {
                    const price = e.target.value;
                    const sqft = comp1Data.squareFeet;
                    const acres = comp1Data.acres;
                    const pricePerSqFt = price && sqft ? (parseFloat(price) / parseFloat(sqft)).toFixed(2) : '';
                    const pricePerAcre = price && acres ? (parseFloat(price) / parseFloat(acres)).toFixed(2) : '';
                    setComp1Data({ 
                      ...comp1Data, 
                      salePrice: price,
                      pricePerSqFt,
                      pricePerAcre
                    });
                  }}
                  InputProps={{ 
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                    inputProps: { min: 0 }
                  }}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Price per Square Foot"
                  type="number"
                  value={comp1Data.pricePerSqFt || ''}
                  onChange={(e) => {
                    const pricePerSqFt = e.target.value;
                    const sqft = comp1Data.squareFeet;
                    if (sqft) {
                      const calculatedPrice = pricePerSqFt ? (parseFloat(pricePerSqFt) * parseFloat(sqft)).toString() : '';
                      setComp1Data({ 
                        ...comp1Data, 
                        pricePerSqFt,
                        salePrice: calculatedPrice,
                        pricePerAcre: calculatedPrice && comp1Data.acres ? 
                          (parseFloat(calculatedPrice) / parseFloat(comp1Data.acres)).toFixed(2) : ''
                      });
                    } else {
                      setComp1Data({ ...comp1Data, pricePerSqFt });
                    }
                  }}
                  InputProps={{ 
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                    inputProps: { min: 0, step: "0.01" }
                  }}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Price per Acre"
                  type="number"
                  value={comp1Data.pricePerAcre || ''}
                  onChange={(e) => {
                    const pricePerAcre = e.target.value;
                    const acres = comp1Data.acres;
                    if (acres) {
                      const calculatedPrice = pricePerAcre ? (parseFloat(pricePerAcre) * parseFloat(acres)).toString() : '';
                      setComp1Data({ 
                        ...comp1Data, 
                        pricePerAcre,
                        salePrice: calculatedPrice,
                        pricePerSqFt: calculatedPrice && comp1Data.squareFeet ? 
                          (parseFloat(calculatedPrice) / parseFloat(comp1Data.squareFeet)).toFixed(2) : ''
                      });
                    } else {
                      setComp1Data({ ...comp1Data, pricePerAcre });
                    }
                  }}
                  InputProps={{ 
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                    inputProps: { min: 0, step: "0.01" }
                  }}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Close Date"
                  type="date"
                  value={comp1Data.closeDate || ''}
                  onChange={(e) => setComp1Data({ ...comp1Data, closeDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Comp 2 Quick Input Section */}
        <Box sx={{ mt: 4, pt: 4, borderTop: 1, borderColor: 'divider' }}>
          <Collapse in={showComp2QuickInput}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ContentPasteIcon />
                <Typography variant="subtitle1">Comp 2 Quick Input</Typography>
                <IconButton
                  size="small"
                  onClick={() => setShowComp2QuickInput(false)}
                  sx={{ ml: 'auto' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Copy and paste comparable property details, and we'll automatically fill in the fields.
              </Typography>
              <TextareaAutosize
                minRows={4}
                placeholder="Paste comparable property details here..."
                value={comp2PasteInput}
                onChange={(e) => setComp2PasteInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '8px',
                  fontFamily: 'inherit',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
              <Button
                variant="contained"
                onClick={parseComp2InputData}
                disabled={!comp2PasteInput}
                fullWidth
              >
                Parse Comp 2 Data
              </Button>
              {comp2ParseError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {comp2ParseError}
                </Alert>
              )}
            </Box>
          </Collapse>

          {!showComp2QuickInput && (
            <Button
              variant="outlined"
              startIcon={<ContentPasteIcon />}
              onClick={() => setShowComp2QuickInput(true)}
            >
              Show Comp 2 Quick Input
            </Button>
          )}

          {/* Comp 2 Details Form */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
              Comp 2 Details
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flexGrow: 1, width: '100%' }}>
                <TextField
                  fullWidth
                  label="Property Address"
                  value={comp2Data.address}
                  onChange={(e) => setComp2Data({ ...comp2Data, address: e.target.value })}
                  placeholder="Enter the property address"
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Number of Acres"
                  type="number"
                  value={comp2Data.acres}
                  onChange={(e) => {
                    const acres = e.target.value;
                    const sqft = acres ? (parseFloat(acres) * SQUARE_FEET_PER_ACRE).toFixed(0) : '';
                    setComp2Data({ 
                      ...comp2Data, 
                      acres: acres,
                      squareFeet: sqft
                    });
                  }}
                  InputProps={{ 
                    inputProps: { min: 0, step: "0.0001" }
                  }}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Square Feet"
                  type="number"
                  value={comp2Data.squareFeet}
                  onChange={(e) => {
                    const sqft = e.target.value;
                    const acres = sqft ? (parseFloat(sqft) / SQUARE_FEET_PER_ACRE).toFixed(4) : '';
                    setComp2Data({ 
                      ...comp2Data, 
                      squareFeet: sqft,
                      acres: acres
                    });
                  }}
                  InputProps={{ 
                    inputProps: { min: 0 }
                  }}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Days on Market (DOM)"
                  type="number"
                  value={comp2Data.dom || ''}
                  onChange={(e) => setComp2Data({ ...comp2Data, dom: e.target.value })}
                  InputProps={{ 
                    inputProps: { min: 0 }
                  }}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Sale Price"
                  type="number"
                  value={comp2Data.salePrice}
                  onChange={(e) => {
                    const price = e.target.value;
                    const sqft = comp2Data.squareFeet;
                    const acres = comp2Data.acres;
                    const pricePerSqFt = price && sqft ? (parseFloat(price) / parseFloat(sqft)).toFixed(2) : '';
                    const pricePerAcre = price && acres ? (parseFloat(price) / parseFloat(acres)).toFixed(2) : '';
                    setComp2Data({ 
                      ...comp2Data, 
                      salePrice: price,
                      pricePerSqFt,
                      pricePerAcre
                    });
                  }}
                  InputProps={{ 
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                    inputProps: { min: 0 }
                  }}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Price per Square Foot"
                  type="number"
                  value={comp2Data.pricePerSqFt || ''}
                  onChange={(e) => {
                    const pricePerSqFt = e.target.value;
                    const sqft = comp2Data.squareFeet;
                    if (sqft) {
                      const calculatedPrice = pricePerSqFt ? (parseFloat(pricePerSqFt) * parseFloat(sqft)).toString() : '';
                      setComp2Data({ 
                        ...comp2Data, 
                        pricePerSqFt,
                        salePrice: calculatedPrice,
                        pricePerAcre: calculatedPrice && comp2Data.acres ? 
                          (parseFloat(calculatedPrice) / parseFloat(comp2Data.acres)).toFixed(2) : ''
                      });
                    } else {
                      setComp2Data({ ...comp2Data, pricePerSqFt });
                    }
                  }}
                  InputProps={{ 
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                    inputProps: { min: 0, step: "0.01" }
                  }}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Price per Acre"
                  type="number"
                  value={comp2Data.pricePerAcre || ''}
                  onChange={(e) => {
                    const pricePerAcre = e.target.value;
                    const acres = comp2Data.acres;
                    if (acres) {
                      const calculatedPrice = pricePerAcre ? (parseFloat(pricePerAcre) * parseFloat(acres)).toString() : '';
                      setComp2Data({ 
                        ...comp2Data, 
                        pricePerAcre,
                        salePrice: calculatedPrice,
                        pricePerSqFt: calculatedPrice && comp2Data.squareFeet ? 
                          (parseFloat(calculatedPrice) / parseFloat(comp2Data.squareFeet)).toFixed(2) : ''
                      });
                    } else {
                      setComp2Data({ ...comp2Data, pricePerAcre });
                    }
                  }}
                  InputProps={{ 
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                    inputProps: { min: 0, step: "0.01" }
                  }}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Close Date"
                  type="date"
                  value={comp2Data.closeDate || ''}
                  onChange={(e) => setComp2Data({ ...comp2Data, closeDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Comp 3 Quick Input Section */}
        <Box sx={{ mt: 4, pt: 4, borderTop: 1, borderColor: 'divider' }}>
          <Collapse in={showComp3QuickInput}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ContentPasteIcon />
                <Typography variant="subtitle1">Comp 3 Quick Input</Typography>
                <IconButton
                  size="small"
                  onClick={() => setShowComp3QuickInput(false)}
                  sx={{ ml: 'auto' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Copy and paste comparable property details, and we'll automatically fill in the fields.
              </Typography>
              <TextareaAutosize
                minRows={4}
                placeholder="Paste comparable property details here..."
                value={comp3PasteInput}
                onChange={(e) => setComp3PasteInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '8px',
                  fontFamily: 'inherit',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
              <Button
                variant="contained"
                onClick={parseComp3InputData}
                disabled={!comp3PasteInput}
                fullWidth
              >
                Parse Comp 3 Data
              </Button>
              {comp3ParseError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {comp3ParseError}
                </Alert>
              )}
            </Box>
          </Collapse>

          {!showComp3QuickInput && (
            <Button
              variant="outlined"
              startIcon={<ContentPasteIcon />}
              onClick={() => setShowComp3QuickInput(true)}
            >
              Show Comp 3 Quick Input
            </Button>
          )}

          {/* Comp 3 Details Form */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
              Comp 3 Details
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flexGrow: 1, width: '100%' }}>
                <TextField
                  fullWidth
                  label="Property Address"
                  value={comp3Data.address}
                  onChange={(e) => setComp3Data({ ...comp3Data, address: e.target.value })}
                  placeholder="Enter the property address"
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Number of Acres"
                  type="number"
                  value={comp3Data.acres}
                  onChange={(e) => {
                    const acres = e.target.value;
                    const sqft = acres ? (parseFloat(acres) * SQUARE_FEET_PER_ACRE).toFixed(0) : '';
                    setComp3Data({ 
                      ...comp3Data, 
                      acres: acres,
                      squareFeet: sqft
                    });
                  }}
                  InputProps={{ 
                    inputProps: { min: 0, step: "0.0001" }
                  }}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Square Feet"
                  type="number"
                  value={comp3Data.squareFeet}
                  onChange={(e) => {
                    const sqft = e.target.value;
                    const acres = sqft ? (parseFloat(sqft) / SQUARE_FEET_PER_ACRE).toFixed(4) : '';
                    setComp3Data({ 
                      ...comp3Data, 
                      squareFeet: sqft,
                      acres: acres
                    });
                  }}
                  InputProps={{ 
                    inputProps: { min: 0 }
                  }}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Days on Market (DOM)"
                  type="number"
                  value={comp3Data.dom || ''}
                  onChange={(e) => setComp3Data({ ...comp3Data, dom: e.target.value })}
                  InputProps={{ 
                    inputProps: { min: 0 }
                  }}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Sale Price"
                  type="number"
                  value={comp3Data.salePrice}
                  onChange={(e) => {
                    const price = e.target.value;
                    const sqft = comp3Data.squareFeet;
                    const acres = comp3Data.acres;
                    const pricePerSqFt = price && sqft ? (parseFloat(price) / parseFloat(sqft)).toFixed(2) : '';
                    const pricePerAcre = price && acres ? (parseFloat(price) / parseFloat(acres)).toFixed(2) : '';
                    setComp3Data({ 
                      ...comp3Data, 
                      salePrice: price,
                      pricePerSqFt,
                      pricePerAcre
                    });
                  }}
                  InputProps={{ 
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                    inputProps: { min: 0 }
                  }}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Price per Square Foot"
                  type="number"
                  value={comp3Data.pricePerSqFt || ''}
                  onChange={(e) => {
                    const pricePerSqFt = e.target.value;
                    const sqft = comp3Data.squareFeet;
                    if (sqft) {
                      const calculatedPrice = pricePerSqFt ? (parseFloat(pricePerSqFt) * parseFloat(sqft)).toString() : '';
                      setComp3Data({ 
                        ...comp3Data, 
                        pricePerSqFt,
                        salePrice: calculatedPrice,
                        pricePerAcre: calculatedPrice && comp3Data.acres ? 
                          (parseFloat(calculatedPrice) / parseFloat(comp3Data.acres)).toFixed(2) : ''
                      });
                    } else {
                      setComp3Data({ ...comp3Data, pricePerSqFt });
                    }
                  }}
                  InputProps={{ 
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                    inputProps: { min: 0, step: "0.01" }
                  }}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Price per Acre"
                  type="number"
                  value={comp3Data.pricePerAcre || ''}
                  onChange={(e) => {
                    const pricePerAcre = e.target.value;
                    const acres = comp3Data.acres;
                    if (acres) {
                      const calculatedPrice = pricePerAcre ? (parseFloat(pricePerAcre) * parseFloat(acres)).toString() : '';
                      setComp3Data({ 
                        ...comp3Data, 
                        pricePerAcre,
                        salePrice: calculatedPrice,
                        pricePerSqFt: calculatedPrice && comp3Data.squareFeet ? 
                          (parseFloat(calculatedPrice) / parseFloat(comp3Data.squareFeet)).toFixed(2) : ''
                      });
                    } else {
                      setComp3Data({ ...comp3Data, pricePerAcre });
                    }
                  }}
                  InputProps={{ 
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                    inputProps: { min: 0, step: "0.01" }
                  }}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Close Date"
                  type="date"
                  value={comp3Data.closeDate || ''}
                  onChange={(e) => setComp3Data({ ...comp3Data, closeDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Comparable Analysis Results */}
        <Box sx={{ mt: 4, pt: 4, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom>
            Comparable Analysis Results
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Summary Table */}
            <Box sx={{ 
              border: 1, 
              borderColor: 'divider', 
              borderRadius: 1,
              overflow: 'auto'
            }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.main' }}>
                    <TableCell sx={{ color: 'white' }}>Property</TableCell>
                    <TableCell align="right" sx={{ color: 'white' }}>Sale Price</TableCell>
                    <TableCell align="right" sx={{ color: 'white' }}>Square Feet</TableCell>
                    <TableCell align="right" sx={{ color: 'white' }}>Price/SqFt</TableCell>
                    <TableCell align="right" sx={{ color: 'white' }}>Acres</TableCell>
                    <TableCell align="right" sx={{ color: 'white' }}>Price/Acre</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Comp 1</TableCell>
                    <TableCell align="right">
                      {comp1Data.salePrice ? `$${parseInt(comp1Data.salePrice).toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell align="right">
                      {comp1Data.squareFeet ? parseInt(comp1Data.squareFeet).toLocaleString() : '-'}
                    </TableCell>
                    <TableCell align="right">
                      {comp1Data.pricePerSqFt ? `$${parseFloat(comp1Data.pricePerSqFt).toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell align="right">
                      {comp1Data.acres ? parseFloat(comp1Data.acres).toFixed(4) : '-'}
                    </TableCell>
                    <TableCell align="right">
                      {comp1Data.pricePerAcre ? `$${parseInt(comp1Data.pricePerAcre).toLocaleString()}` : '-'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Comp 2</TableCell>
                    <TableCell align="right">
                      {comp2Data.salePrice ? `$${parseInt(comp2Data.salePrice).toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell align="right">
                      {comp2Data.squareFeet ? parseInt(comp2Data.squareFeet).toLocaleString() : '-'}
                    </TableCell>
                    <TableCell align="right">
                      {comp2Data.pricePerSqFt ? `$${parseFloat(comp2Data.pricePerSqFt).toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell align="right">
                      {comp2Data.acres ? parseFloat(comp2Data.acres).toFixed(4) : '-'}
                    </TableCell>
                    <TableCell align="right">
                      {comp2Data.pricePerAcre ? `$${parseInt(comp2Data.pricePerAcre).toLocaleString()}` : '-'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Comp 3</TableCell>
                    <TableCell align="right">
                      {comp3Data.salePrice ? `$${parseInt(comp3Data.salePrice).toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell align="right">
                      {comp3Data.squareFeet ? parseInt(comp3Data.squareFeet).toLocaleString() : '-'}
                    </TableCell>
                    <TableCell align="right">
                      {comp3Data.pricePerSqFt ? `$${parseFloat(comp3Data.pricePerSqFt).toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell align="right">
                      {comp3Data.acres ? parseFloat(comp3Data.acres).toFixed(4) : '-'}
                    </TableCell>
                    <TableCell align="right">
                      {comp3Data.pricePerAcre ? `$${parseInt(comp3Data.pricePerAcre).toLocaleString()}` : '-'}
                    </TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow sx={{ backgroundColor: 'grey.100' }}>
                    <TableCell><strong>Average</strong></TableCell>
                    <TableCell align="right">
                      {(() => {
                        const validPrices = [comp1Data.salePrice, comp2Data.salePrice, comp3Data.salePrice]
                          .filter(price => price && !isNaN(parseFloat(price)));
                        if (validPrices.length === 0) return '-';
                        const avg = validPrices.reduce((sum, price) => sum + parseFloat(price), 0) / validPrices.length;
                        return `$${avg.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
                      })()}
                    </TableCell>
                    <TableCell align="right">
                      {(() => {
                        const validSqft = [comp1Data.squareFeet, comp2Data.squareFeet, comp3Data.squareFeet]
                          .filter(sqft => sqft && !isNaN(parseFloat(sqft)));
                        if (validSqft.length === 0) return '-';
                        const avg = validSqft.reduce((sum, sqft) => sum + parseFloat(sqft), 0) / validSqft.length;
                        return avg.toLocaleString(undefined, { maximumFractionDigits: 0 });
                      })()}
                    </TableCell>
                    <TableCell align="right">
                      {(() => {
                        const validPrices = [comp1Data.pricePerSqFt, comp2Data.pricePerSqFt, comp3Data.pricePerSqFt]
                          .filter(price => price && !isNaN(parseFloat(price)));
                        if (validPrices.length === 0) return '-';
                        const avg = validPrices.reduce((sum, price) => sum + parseFloat(price), 0) / validPrices.length;
                        return `$${avg.toFixed(2)}`;
                      })()}
                    </TableCell>
                    <TableCell align="right">
                      {(() => {
                        const validAcres = [comp1Data.acres, comp2Data.acres, comp3Data.acres]
                          .filter(acres => acres && !isNaN(parseFloat(acres)));
                        if (validAcres.length === 0) return '-';
                        const avg = validAcres.reduce((sum, acres) => sum + parseFloat(acres), 0) / validAcres.length;
                        return avg.toFixed(4);
                      })()}
                    </TableCell>
                    <TableCell align="right">
                      {(() => {
                        const validPrices = [comp1Data.pricePerAcre, comp2Data.pricePerAcre, comp3Data.pricePerAcre]
                          .filter(price => price && !isNaN(parseFloat(price)));
                        if (validPrices.length === 0) return '-';
                        const avg = validPrices.reduce((sum, price) => sum + parseFloat(price), 0) / validPrices.length;
                        return `$${avg.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
                      })()}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </Box>

            {/* Analysis Card */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Market Analysis Summary
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Based on the comparable properties:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2">
                    • Average Price per Square Foot: {(() => {
                      const validPrices = [comp1Data.pricePerSqFt, comp2Data.pricePerSqFt, comp3Data.pricePerSqFt]
                        .filter(price => price && !isNaN(parseFloat(price)));
                      if (validPrices.length === 0) return 'Not enough data';
                      const avg = validPrices.reduce((sum, price) => sum + parseFloat(price), 0) / validPrices.length;
                      return `$${avg.toFixed(2)}`;
                    })()}
                  </Typography>
                  <Typography variant="body2">
                    • Average Price per Acre: {(() => {
                      const validPrices = [comp1Data.pricePerAcre, comp2Data.pricePerAcre, comp3Data.pricePerAcre]
                        .filter(price => price && !isNaN(parseFloat(price)));
                      if (validPrices.length === 0) return 'Not enough data';
                      const avg = validPrices.reduce((sum, price) => sum + parseFloat(price), 0) / validPrices.length;
                      return `$${avg.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
                    })()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Subject Property Market Value Analysis */}
            <Card variant="outlined" sx={{ bgcolor: '#f5f5f5', border: '1px solid', borderColor: 'primary.main' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                  Subject Property Market Value Analysis
                </Typography>
                {(() => {
                  // Calculate average price per square foot from comps
                  const validPrices = [comp1Data.pricePerSqFt, comp2Data.pricePerSqFt, comp3Data.pricePerSqFt]
                    .filter(price => price && !isNaN(parseFloat(price)));
                  const avgPricePerSqFt = validPrices.length > 0 
                    ? validPrices.reduce((sum, price) => sum + parseFloat(price), 0) / validPrices.length
                    : 0;

                  // Get subject property square footage
                  const subjectSqFt = squareFeet ? parseFloat(squareFeet) : 0;

                  // Calculate estimated market value
                  const estimatedValue = avgPricePerSqFt * subjectSqFt;

                  if (!avgPricePerSqFt || !subjectSqFt) {
                    return (
                      <Alert severity="warning" sx={{ mt: 1 }}>
                        Please ensure both the subject property square footage and comparable sales data are entered to calculate the estimated market value.
                      </Alert>
                    );
                  }

                  return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="subtitle2" color="primary" sx={{ mb: 0.5 }}>
                          Subject Property Details:
                        </Typography>
                        <Typography variant="body1">
                          • Square Footage: {parseInt(squareFeet).toLocaleString()} sq ft ({parseFloat(acres).toFixed(4)} acres)
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="subtitle2" color="primary" sx={{ mb: 0.5 }}>
                          Calculation:
                        </Typography>
                        <Typography variant="body1">
                          • Average Price per Square Foot: ${avgPricePerSqFt.toFixed(2)}
                        </Typography>
                        <Typography variant="body1">
                          • Subject Property Size: {parseInt(squareFeet).toLocaleString()} sq ft ({parseFloat(acres).toFixed(4)} acres)
                        </Typography>
                      </Box>

                      <Box sx={{ mt: 1, p: 2, bgcolor: 'primary.main', borderRadius: 1 }}>
                        <Typography variant="h6" sx={{ color: 'white' }}>
                          Estimated Market Value: ${estimatedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </Typography>
                        {baseValue && (
                          <Typography variant="body2" sx={{ color: 'white', mt: 1 }}>
                            {estimatedValue > parseFloat(baseValue) 
                              ? `This is ${(((estimatedValue / parseFloat(baseValue)) - 1) * 100).toFixed(1)}% above the asking price`
                              : `This is ${(((parseFloat(baseValue) / estimatedValue) - 1) * 100).toFixed(1)}% below the asking price`}
                          </Typography>
                        )}
                      </Box>

                      {/* Percentage Breakdown Table */}
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>
                          Market Value Percentage Breakdown:
                        </Typography>
                        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ bgcolor: 'grey.100' }}>
                                <TableCell>Percentage</TableCell>
                                <TableCell align="right">Value</TableCell>
                                <TableCell align="right">Per Sq Ft</TableCell>
                                <TableCell align="right">Per Acre</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {[90, 80, 70, 60, 50, 40, 30, 20, 10].map((percentage) => {
                                const value = (estimatedValue * (percentage / 100));
                                const perSqFt = value / parseFloat(squareFeet);
                                const perAcre = value / parseFloat(acres);
                                return (
                                  <TableRow key={percentage}>
                                    <TableCell>{percentage}%</TableCell>
                                    <TableCell align="right">
                                      ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </TableCell>
                                    <TableCell align="right">
                                      ${perSqFt.toFixed(2)}
                                    </TableCell>
                                    <TableCell align="right">
                                      ${perAcre.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          This breakdown shows various percentage values of the estimated market value, 
                          helping to understand different value points for negotiation or analysis.
                        </Typography>
                      </Box>
                    </Box>
                  );
                })()}
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Active Listing Section */}
        <Box sx={{ mt: 4, pt: 4, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'warning.main' }}>
            🏠 Active Listing Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Add current active listings to understand what your subject property cannot sell for and market competition.
          </Typography>
          
          <Collapse in={showActiveListingQuickInput}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ContentPasteIcon />
                <Typography variant="subtitle1">Active Listing Quick Input</Typography>
                <IconButton
                  size="small"
                  onClick={() => setShowActiveListingQuickInput(false)}
                  sx={{ ml: 'auto' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Copy and paste active listing details from MLS, and we'll automatically parse the information.
              </Typography>
              <TextareaAutosize
                minRows={4}
                placeholder="Paste active listing details from MLS here..."
                value={activeListingPasteInput}
                onChange={(e) => setActiveListingPasteInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '8px',
                  fontFamily: 'inherit',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
              <Button
                variant="contained"
                color="warning"
                onClick={parseActiveListingInputData}
                disabled={!activeListingPasteInput}
                fullWidth
              >
                Parse Active Listing Data
              </Button>
              {activeListingParseError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {activeListingParseError}
                </Alert>
              )}
            </Box>
          </Collapse>

          {!showActiveListingQuickInput && (
            <Button
              variant="outlined"
              color="warning"
              startIcon={<ContentPasteIcon />}
              onClick={() => setShowActiveListingQuickInput(true)}
            >
              Show Active Listing Quick Input
            </Button>
          )}

          {/* Active Listing Details Form */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'warning.main' }}>
              Active Listing Details
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flexGrow: 1, width: '100%' }}>
                <TextField
                  fullWidth
                  label="Property Address"
                  value={activeListingData.address}
                  onChange={(e) => setActiveListingData({ ...activeListingData, address: e.target.value })}
                  placeholder="Enter the property address"
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="List Price"
                  type="number"
                  value={activeListingData.listPrice}
                  onChange={(e) => setActiveListingData({ ...activeListingData, listPrice: e.target.value })}
                  placeholder="Enter list price"
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Days on Market"
                  type="number"
                  value={activeListingData.daysOnMarket}
                  onChange={(e) => setActiveListingData({ ...activeListingData, daysOnMarket: e.target.value })}
                  placeholder="Enter days on market"
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Number of Acres"
                  type="number"
                  value={activeListingData.acres}
                  onChange={(e) => {
                    const acres = e.target.value;
                    const sqft = acres ? (parseFloat(acres) * SQUARE_FEET_PER_ACRE).toFixed(0) : '';
                    setActiveListingData({ 
                      ...activeListingData, 
                      acres: acres,
                      squareFeet: sqft
                    });
                  }}
                  placeholder="Enter number of acres"
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="Square Feet"
                  type="number"
                  value={activeListingData.squareFeet}
                  onChange={(e) => {
                    const sqft = e.target.value;
                    const acres = sqft ? (parseFloat(sqft) / SQUARE_FEET_PER_ACRE).toFixed(4) : '';
                    setActiveListingData({ 
                      ...activeListingData, 
                      squareFeet: sqft,
                      acres: acres
                    });
                  }}
                  placeholder="Enter square footage"
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(33.33% - 8px)' } }}>
                <TextField
                  fullWidth
                  label="List Date"
                  value={activeListingData.listDate}
                  onChange={(e) => setActiveListingData({ ...activeListingData, listDate: e.target.value })}
                  placeholder="MM/DD/YYYY"
                />
              </Box>
            </Box>

            {/* Active Listing Analysis Card */}
            <Card variant="outlined" sx={{ mt: 3, bgcolor: '#fff3e0', border: '1px solid', borderColor: 'warning.main' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'warning.main' }}>
                  Active Listing Analysis
                </Typography>
                {activeListingData.listPrice && activeListingData.acres && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="body2">
                      <strong>List Price per Acre:</strong> ${(() => {
                        const pricePerAcre = parseFloat(activeListingData.listPrice) / parseFloat(activeListingData.acres);
                        return pricePerAcre.toLocaleString(undefined, { maximumFractionDigits: 0 });
                      })()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>List Price per Square Foot:</strong> ${(() => {
                        const pricePerSqFt = parseFloat(activeListingData.listPrice) / parseFloat(activeListingData.squareFeet);
                        return pricePerSqFt.toFixed(2);
                      })()}
                    </Typography>
                    {activeListingData.daysOnMarket && (
                      <Typography variant="body2">
                        <strong>Days on Market:</strong> {activeListingData.daysOnMarket} days
                      </Typography>
                    )}
                    <Alert severity="info" sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        <strong>Market Insight:</strong> This active listing shows what similar properties are currently asking for. 
                        If this listing has been on the market for an extended period, it may indicate the asking price is too high 
                        for current market conditions.
                      </Typography>
                    </Alert>
                  </Box>
                )}
                {(!activeListingData.listPrice || !activeListingData.acres) && (
                  <Typography variant="body2" color="text.secondary">
                    Enter list price and acreage to see analysis.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}; 