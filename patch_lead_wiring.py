with open("src/components/InstantQuoteMaker.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_logic = """    try {
      const serviceTypeVal = quoteCategory === 'Construction' 
        ? `Construction - ${constPackage}` 
        : serviceType;
      const plotSizeVal = quoteCategory === 'Construction' ? constArea : serviceSize;
      const budgetVal = getEstimate();
      
      const { error } = await supabase.from('leads').insert([{
        name: name,
        phone: phone,
        service_type: serviceTypeVal,
        plot_size: plotSizeVal,
        budget: budgetVal,
        source: 'Website Quote',
        status: 'New',
        lead_temperature: 'Warm',
        notes: `Auto-generated from Instant Quote Maker. Category: ${quoteCategory}`
      }]);"""

new_logic = """    try {
      const serviceTypeVal = quoteCategory === 'Construction' 
        ? `Construction - ${constPackage} (${floor})` 
        : serviceType === 'Interior Design' || serviceType === '3D Front Elevation'
          ? serviceType
          : `${serviceType} (${floor})`;
          
      const plotSizeVal = quoteCategory === 'Construction' 
        ? `${constArea} (Total: ${constArea * getFloorMultiplier(floor)})` 
        : serviceType === 'Interior Design'
          ? `${serviceSize} Rooms`
          : serviceType === '3D Front Elevation'
            ? 'Flat Rate'
            : `${serviceSize} (Total: ${serviceSize * getFloorMultiplier(floor)})`;
            
      const budgetVal = getEstimate();
      
      const detailedNotes = quoteCategory === 'Construction'
        ? `Auto-generated Quote.\\nLocation: ${constLocation}\\nPackage: ${constPackage}\\nFloor: ${floor}\\nBase Area: ${constArea} sq.ft\\nTotal Multiplied Area: ${constArea * getFloorMultiplier(floor)} sq.ft`
        : `Auto-generated Quote.\\nService: ${serviceType}\\nFloor: ${serviceType === 'Interior Design' || serviceType === '3D Front Elevation' ? 'N/A' : floor}\\nQty/Area: ${serviceSize}`;

      const { error } = await supabase.from('leads').insert([{
        name: name,
        phone: phone,
        service_type: serviceTypeVal,
        plot_size: plotSizeVal.toString(),
        budget: budgetVal,
        source: 'Website Quote',
        status: 'New',
        lead_temperature: 'Warm',
        notes: detailedNotes
      }]);"""

content = content.replace(old_logic, new_logic)

with open("src/components/InstantQuoteMaker.tsx", "w", encoding="utf-8") as f:
    f.write(content)
