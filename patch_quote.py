import re

with open("src/components/InstantQuoteMaker.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update Types
content = content.replace(
    'type PackageType = "Structure Only" | "Standard Finish" | "Premium Finish" | "Luxurious Finish";',
    'type PackageType = "Standard" | "Premium" | "Luxury";\ntype FloorType = "Ground Floor" | "G + 1 Floor" | "G + 2 Floor" | "G + 3 Floor" | "G + 4 & Above";'
)

# 2. Update Rates
old_rates = """const CONSTRUCTION_RATES: Record<LocationType, Record<PackageType, number>> = {
  Plains: {
    "Structure Only": 1200,
    "Standard Finish": 1600,
    "Premium Finish": 2000,
    "Luxurious Finish": 2400,
  },
  Hills: {
    "Structure Only": 1400,
    "Standard Finish": 1800,
    "Premium Finish": 2200,
    "Luxurious Finish": 2600,
  },
};"""

new_rates = """const CONSTRUCTION_RATES: Record<LocationType, Record<FloorType, Record<PackageType, number>>> = {
  Plains: {
    "Ground Floor": { "Standard": 2000, "Premium": 2400, "Luxury": 2800 },
    "G + 1 Floor":  { "Standard": 1800, "Premium": 2200, "Luxury": 2600 },
    "G + 2 Floor":  { "Standard": 1600, "Premium": 2000, "Luxury": 2400 },
    "G + 3 Floor":  { "Standard": 1400, "Premium": 1800, "Luxury": 2200 },
    "G + 4 & Above":{ "Standard": 1200, "Premium": 1600, "Luxury": 2000 }
  },
  Hills: {
    "Ground Floor": { "Standard": 2400, "Premium": 2800, "Luxury": 3200 },
    "G + 1 Floor":  { "Standard": 2200, "Premium": 2600, "Luxury": 3000 },
    "G + 2 Floor":  { "Standard": 2000, "Premium": 2400, "Luxury": 2800 },
    "G + 3 Floor":  { "Standard": 1800, "Premium": 2200, "Luxury": 2600 },
    "G + 4 & Above":{ "Standard": 1600, "Premium": 2000, "Luxury": 2400 }
  }
};

const getFloorMultiplier = (floor: FloorType) => {
  switch(floor) {
    case "Ground Floor": return 1;
    case "G + 1 Floor": return 2;
    case "G + 2 Floor": return 3;
    case "G + 3 Floor": return 4;
    case "G + 4 & Above": return 5;
    default: return 1;
  }
};"""

content = content.replace(old_rates, new_rates)

# 3. Add state for floor
content = content.replace(
    'const [constPackage, setConstPackage] = useState<PackageType>("Standard Finish");',
    'const [constPackage, setConstPackage] = useState<PackageType>("Standard");\n  const [floor, setFloor] = useState<FloorType>("Ground Floor");'
)

# Reset generated state dependency array
content = content.replace(
    '[quoteCategory, serviceType, serviceSize, constLocation, constPackage, constArea, name, phone]',
    '[quoteCategory, serviceType, serviceSize, constLocation, constPackage, constArea, floor, name, phone]'
)

# 4. Update getEstimate
old_getEstimate = """  const getEstimate = () => {
    if (quoteCategory === "Service") {
      if (serviceType === "3D Front Elevation") {
        return SERVICE_RATES[serviceType];
      }
      return SERVICE_RATES[serviceType] * serviceSize;
    } else {
      return CONSTRUCTION_RATES[constLocation][constPackage] * constArea;
    }
  };"""

new_getEstimate = """  const getEstimate = () => {
    if (quoteCategory === "Service") {
      if (serviceType === "3D Front Elevation") {
        return SERVICE_RATES[serviceType];
      }
      if (serviceType === "Interior Design") {
        return SERVICE_RATES[serviceType] * serviceSize;
      }
      return SERVICE_RATES[serviceType] * serviceSize * getFloorMultiplier(floor);
    } else {
      const rate = CONSTRUCTION_RATES[constLocation][floor][constPackage];
      return rate * constArea * getFloorMultiplier(floor);
    }
  };"""

content = content.replace(old_getEstimate, new_getEstimate)

# 5. Update construction inputs
old_const_pkg = """                <div className="col-span-1">
                  <label className="block text-[11px] font-[700] text-[#062B55] mb-2 uppercase tracking-wide">Package</label>
                  <div className="relative">
                    <select 
                      value={constPackage}
                      onChange={(e) => setConstPackage(e.target.value as PackageType)}
                      className="w-full bg-[#F7FBFF] border border-[#062B55]/10 rounded-[10px] px-4 py-3 text-[14px] font-[600] text-[#062B55] focus:outline-none focus:border-[#18AFFF] transition-colors appearance-none"
                    >
                      <option value="Structure Only">Structure Only</option>
                      <option value="Standard Finish">Standard Finish</option>
                      <option value="Premium Finish">Premium Finish</option>
                      <option value="Luxurious Finish">Luxurious Finish</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[18px] text-[#062B55]/40 pointer-events-none">expand_more</span>
                  </div>
                </div>"""

new_const_pkg = """                <div className="col-span-1">
                  <label className="block text-[11px] font-[700] text-[#062B55] mb-2 uppercase tracking-wide">Package</label>
                  <div className="relative">
                    <select 
                      value={constPackage}
                      onChange={(e) => setConstPackage(e.target.value as PackageType)}
                      className="w-full bg-[#F7FBFF] border border-[#062B55]/10 rounded-[10px] px-4 py-3 text-[14px] font-[600] text-[#062B55] focus:outline-none focus:border-[#18AFFF] transition-colors appearance-none"
                    >
                      <option value="Standard">Standard</option>
                      <option value="Premium">Premium</option>
                      <option value="Luxury">Luxury</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[18px] text-[#062B55]/40 pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                  <label className="block text-[11px] font-[700] text-[#062B55] mb-2 uppercase tracking-wide">Floor Elevation</label>
                  <div className="relative">
                    <select 
                      value={floor}
                      onChange={(e) => setFloor(e.target.value as FloorType)}
                      className="w-full bg-[#F7FBFF] border border-[#062B55]/10 rounded-[10px] px-4 py-3 text-[14px] font-[600] text-[#062B55] focus:outline-none focus:border-[#18AFFF] transition-colors appearance-none"
                    >
                      <option value="Ground Floor">Ground Floor</option>
                      <option value="G + 1 Floor">G + 1 Floor</option>
                      <option value="G + 2 Floor">G + 2 Floor</option>
                      <option value="G + 3 Floor">G + 3 Floor</option>
                      <option value="G + 4 & Above">G + 4 & Above</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[18px] text-[#062B55]/40 pointer-events-none">expand_more</span>
                  </div>
                </div>"""

content = content.replace(old_const_pkg, new_const_pkg)

# 6. Update service inputs
# Find the exact service size UI and put Floor next to it.
old_service_size = """                <div className={`col-span-1 ${serviceType === "3D Front Elevation" ? "opacity-40 pointer-events-none transition-opacity" : "transition-opacity"}`}>
                  <label className="block text-[11px] font-[700] text-[#062B55] mb-2 uppercase tracking-wide">
                    {serviceType === "Interior Design" ? "Rooms" : "Area"} <span className="text-[#062B55]/50 capitalize normal-case text-[10px] ml-1">({getServiceUnit(serviceType)})</span>
                  </label>"""

new_service_size = """                <div className={`col-span-1 ${serviceType === "Interior Design" || serviceType === "3D Front Elevation" ? "opacity-40 pointer-events-none transition-opacity" : "transition-opacity"}`}>
                  <label className="block text-[11px] font-[700] text-[#062B55] mb-2 uppercase tracking-wide">Floor Elevation</label>
                  <div className="relative">
                    <select 
                      value={floor}
                      onChange={(e) => setFloor(e.target.value as FloorType)}
                      disabled={serviceType === "Interior Design" || serviceType === "3D Front Elevation"}
                      className="w-full bg-[#F7FBFF] border border-[#062B55]/10 rounded-[10px] px-4 py-3 text-[14px] font-[600] text-[#062B55] focus:outline-none focus:border-[#18AFFF] transition-colors appearance-none"
                    >
                      <option value="Ground Floor">Ground Floor</option>
                      <option value="G + 1 Floor">G + 1 Floor</option>
                      <option value="G + 2 Floor">G + 2 Floor</option>
                      <option value="G + 3 Floor">G + 3 Floor</option>
                      <option value="G + 4 & Above">G + 4 & Above</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[18px] text-[#062B55]/40 pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className={`col-span-1 md:col-span-2 lg:col-span-1 ${serviceType === "3D Front Elevation" ? "opacity-40 pointer-events-none transition-opacity" : "transition-opacity"}`}>
                  <label className="block text-[11px] font-[700] text-[#062B55] mb-2 uppercase tracking-wide">
                    {serviceType === "Interior Design" ? "Rooms" : "Area"} <span className="text-[#062B55]/50 capitalize normal-case text-[10px] ml-1">({getServiceUnit(serviceType)})</span>
                  </label>"""

content = content.replace(old_service_size, new_service_size)

# 7. Update display summary texts and WhatsApp URLs
old_display = '`${constLocation} • ${constPackage} • ${constArea} sq.ft.`'
new_display = '`${constLocation} • ${constPackage} • ${floor} • ${constArea * getFloorMultiplier(floor)} total sq.ft.`'
content = content.replace(old_display, new_display)

old_wa_serv = '`${serviceSize} ${getServiceUnit(serviceType)}`'
new_wa_serv = 'serviceType === "Interior Design" ? `${serviceSize} ${getServiceUnit(serviceType)}` : `${serviceSize * getFloorMultiplier(floor)} total ${getServiceUnit(serviceType)} (${floor})`'
content = content.replace(old_wa_serv, new_wa_serv)

old_wa_const = '`${constLocation}\\n*Package:* ${constPackage}\\n*Area:* ${constArea} sq.ft.\\n*Estimated Cost:*'
new_wa_const = '`${constLocation}\\n*Package:* ${constPackage}\\n*Floor:* ${floor}\\n*Total Area:* ${constArea * getFloorMultiplier(floor)} sq.ft.\\n*Estimated Cost:*'
content = content.replace(old_wa_const, new_wa_const)


with open("src/components/InstantQuoteMaker.tsx", "w", encoding="utf-8") as f:
    f.write(content)
