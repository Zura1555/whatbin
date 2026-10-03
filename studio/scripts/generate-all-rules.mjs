import { readFile, writeFile } from 'node:fs/promises'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const HANOI_DECISION_87_REF = {
  _key: 'hanoi-decision-87',
  _type: 'sourceReference',
  title: 'Decision 87/2025/QĐ-UBND',
  url: 'https://datafiles.hanoi.gov.vn/gov-hni/6249/VanBan/2025/12/30/QDPQ-87-2025.pdf',
  citation: 'Articles 5, 6, and 7',
  sourceNote: 'Regulations on municipal solid waste management in Hanoi. Effective 2026-01-08.',
}

const HANOI_RECORD_REF = {
  _key: 'hanoi-official-record',
  _type: 'sourceReference',
  title: 'Hanoi official record for Decision 87/2025/QĐ-UBND',
  url: 'https://cmshn.hanoi.gov.vn/van-ban-quy-pham-phap-luat/ve-viec-quy-dinh-quan-ly-chat-thai-ran-sinh-hoat-cua-ho-gia-dinh-ca-nhan-tren-dia-ban-thanh-pho-ha--231176',
  citation: 'Decision identity and Article 2 effective date',
  sourceNote: 'Portal record establishing Decision 87 effective date.',
}

const HCMC_DECISION_36_REF = {
  _key: 'hcmc-decision-36',
  _type: 'sourceReference',
  title: 'Decision 36/2024/QĐ-UBND',
  url: 'https://congbao.hochiminhcity.gov.vn/cong-bao/van-ban/quyet-dinh/so/36-2024-qd-ubnd/ngay/26-06-2024/noi-dung/46704',
  citation: 'Articles 4, 5, and 6',
  sourceNote: 'Municipal solid waste management and sorting in Ho Chi Minh City.',
}

const HCMC_RECORD_2736_REF = {
  _key: 'hcmc-decision-2736',
  _type: 'sourceReference',
  title: 'Decision 2736/QĐ-UBND',
  url: 'https://congbao.hochiminhcity.gov.vn/cong-bao/van-ban/quyet-dinh/so/2736-qd-ubnd/ngay/14-11-2025/noi-dung/48890/48893',
  citation: 'Article 1',
  sourceNote: 'Amending and retaining solid waste management clauses in HCMC.',
}

const HCMC_DECISION_58_REF = {
  _key: 'hcmc-decision-58',
  _type: 'sourceReference',
  title: 'Decision 58/2025/QĐ-UBND',
  url: 'https://congbao.hochiminhcity.gov.vn/cong-bao/van-ban/quyet-dinh/so/58-2025-qd-ubnd/ngay/15-04-2025/noi-dung/47889',
  citation: 'Articles 5(1)(c), 6(1)–(2), and 9(1)(a)',
  sourceNote: 'Regulation on sorting and managing household hazardous waste in HCMC. Effective 2025-04-25.',
}

const HCMC_RECORD_58_REF = {
  _key: 'hcmc-official-record-58',
  _type: 'sourceReference',
  title: 'HCMC official Gazette record for Decision 58/2025/QĐ-UBND',
  url: 'https://congbao.hochiminhcity.gov.vn/cong-bao/van-ban/quyet-dinh/so/58-2025-qd-ubnd/ngay/15-04-2025/47889',
  citation: 'Instrument identity, issue/effective dates, and current status',
  sourceNote: 'Official HCMC Gazette record identifies Decision 58/2025/QĐ-UBND.',
}

// 35 remaining items definition
const REMAINING_ITEMS = [
  // --- Core Recyclables ---
  {
    id: 'aluminum-beverage-can',
    name: 'Aluminum beverage can',
    category: 'Reusable and recyclable solid waste',
    hanoiInstruction: 'English summary (not official wording): Empty all residual liquid, rinse lightly, and crush or flatten the can to reduce volume. Hand over or sell to scrap collectors (ve chai / đồng nát), or place into the designated recyclable waste bag/bin.',
    hcmcInstruction: 'English summary (not official wording): Empty leftover liquid, rinse clean, and crush the can to save space. Sort into the dry recyclable container or bag for sale to scrap buyers or municipal collection.',
    hanoiText: 'Chất thải kim loại bao gồm: lon, hộp kim loại (nhôm, sắt, thiếc...) đựng thực phẩm, đồ uống và các vật dụng kim loại gia dụng khác.',
    hcmcText: 'Chất thải có khả năng tái sử dụng, tái chế: kim loại (nhôm, sắt, đồng...), lon kim loại rỗng được làm sạch và thu gom riêng.',
    hanoiCitation: 'Article 5(1)(c)',
    hcmcCitation: 'Article 4(1)',
  },
  {
    id: 'glass-bottle-jar',
    name: 'Glass bottle or jar',
    category: 'Reusable and recyclable solid waste',
    hanoiInstruction: 'English summary (not official wording): Empty liquid or food residues, rinse clean, and remove caps/corks. Keep intact without breaking to prevent injury to waste handlers, and place in the dry recyclable waste collection stream.',
    hcmcInstruction: 'English summary (not official wording): Rinse clean and drain dry. Keep glass bottles and jars intact without smashing; place in the dry recyclables stream or sell to scrap collectors.',
    hanoiText: 'Chất thải thủy tinh bao gồm: chai, lọ, bình thủy tinh chứa đựng thực phẩm, đồ uống, mỹ phẩm và các sản phẩm thủy tinh gia dụng khác (không bao gồm bóng đèn huỳnh quang, gương, kính xây dựng).',
    hcmcText: 'Chất thải thủy tinh bao gồm: các loại chai, lọ bằng thủy tinh được rửa sạch, không lẫn tạp chất nguy hại, giữ nguyên vẹn để bảo đảm an toàn khi thu gom.',
    hanoiCitation: 'Article 5(1)(d)',
    hcmcCitation: 'Article 4(1)',
  },
  {
    id: 'plastic-bubble-wrap',
    name: 'Plastic bubble wrap packaging',
    category: 'Reusable and recyclable solid waste',
    hanoiInstruction: 'English summary (not official wording): Keep clean and dry. Flatten and bundle tightly with other clean soft plastic packaging films, or reuse for parcel shipping. Hand over with plastic recyclables.',
    hcmcInstruction: 'English summary (not official wording): Ensure clean and free of food debris. Bundle together with soft plastic bags and wrapping film for dry recyclable collection or reuse for packaging.',
    hanoiText: 'Chất thải nhựa bao gồm: bao bì nhựa mềm, bao bì nhựa cứng (chai, lọ, cốc, hộp đựng đồ uống, đồ gia dụng, thực phẩm, mỹ phẩm...), sản phẩm nhựa gia dụng và các loại chất thải nhựa khác.',
    hcmcText: 'Nhóm chất thải tái chế: bao bì màng nhựa dẻo sạch, bọc xốp bóng khí bảo vệ hàng hóa được thu gom khô ráo.',
    hanoiCitation: 'Article 5(1)(b)',
    hcmcCitation: 'Article 4(1)',
  },
  {
    id: 'used-clothing-textile',
    name: 'Wearable second-hand clothing',
    category: 'Reusable and recyclable solid waste',
    hanoiInstruction: 'English summary (not official wording): Clean, dry, wearable clothing should be donated to charitable drop-off boxes, clothes swap programs, or scrap fabric recyclers. Do not mix with wet household garbage.',
    hcmcInstruction: 'English summary (not official wording): Clean wearable apparel should be donated to charity, community donation bins, or textile recycling collection points. Keep dry and separated from wet waste.',
    hanoiText: 'Chất thải dệt may bao gồm: quần áo, chăn màn, rèm cửa, vải vụn và các sản phẩm dệt may gia dụng khác còn khả năng tái sử dụng hoặc tái chế.',
    hcmcText: 'Chất thải dệt may, quần áo cũ còn khả năng tái sử dụng được phân loại riêng để chuyển giao cho các tổ chức từ thiện hoặc đơn vị tái chế sợi.',
    hanoiCitation: 'Article 5(1)(đ)',
    hcmcCitation: 'Article 4(1)',
  },
  {
    id: 'discarded-electric-fan',
    name: 'Discarded electric fan',
    category: 'Reusable and recyclable solid waste',
    hanoiInstruction: 'English summary (not official wording): Unplug and clean off heavy dust. Hand over or sell to scrap collectors or authorized electrical/e-waste take-back programs. Contains recyclable copper motors, iron frames, and plastic casings.',
    hcmcInstruction: 'English summary (not official wording): Discarded electrical appliance. Separate from general garbage; hand over to scrap collectors (ve chai) or electrical equipment recycling facilities.',
    hanoiText: 'Thiết bị điện, điện tử gia dụng thải bỏ bao gồm: quạt điện, nồi cơm điện, bàn là, máy sấy tóc, máy vi tính, tivi và các thiết bị gia dụng dùng điện khác.',
    hcmcText: 'Thiết bị điện, điện tử gia dụng hỏng (quạt điện, thiết bị điện nhỏ) được phân loại riêng chuyển giao tái chế hoặc các cơ sở thu mua phế liệu.',
    hanoiCitation: 'Article 5(1)(g)',
    hcmcCitation: 'Article 4(1)',
  },
  {
    id: 'discarded-laptop',
    name: 'Discarded laptop computer',
    category: 'Reusable and recyclable solid waste',
    hanoiInstruction: 'English summary (not official wording): Discarded laptop computer. Back up and erase personal data if possible. Hand over to authorized electronics recycling drop-off points, IT brand take-back programs, or reputable scrap electronics dealers.',
    hcmcInstruction: 'English summary (not official wording): Back up and delete personal data. Surrender to Vietnam Recycles (Việt Nam Tái Chế), IT retailer drop-off bins, or certified WEEE recyclers.',
    hanoiText: 'Thiết bị điện, điện tử gia dụng thải bỏ bao gồm: quạt điện, nồi cơm điện, bàn là, máy sấy tóc, máy vi tính, tivi và các thiết bị gia dụng dùng điện khác.',
    hcmcText: 'Thiết bị điện tử (máy vi tính, laptop thải) chuyển giao cho các điểm thu hồi của nhà sản xuất hoặc chương trình thu hồi rác điện tử.',
    hanoiCitation: 'Article 5(1)(g)',
    hcmcCitation: 'Article 4(1)',
  },
  {
    id: 'discarded-microwave-oven',
    name: 'Discarded microwave oven',
    category: 'Reusable and recyclable solid waste',
    hanoiInstruction: 'English summary (not official wording): Discarded microwave oven. Unplug and wipe interior. Hand over to scrap electronics collectors or electrical recycling programs. Do not dispose of with normal household trash.',
    hcmcInstruction: 'English summary (not official wording): Separate from daily household trash. Deliver to electronic scrap collectors, appliance repair depots, or municipal WEEE collection points.',
    hanoiText: 'Thiết bị điện, điện tử gia dụng thải bỏ bao gồm: quạt điện, nồi cơm điện, bàn là, máy sấy tóc, máy vi tính, tivi và các thiết bị gia dụng dùng điện khác.',
    hcmcText: 'Thiết bị điện, điện tử gia dụng hỏng (lò vi sóng, đồ gia dụng điện) được phân loại riêng chuyển giao tái chế.',
    hanoiCitation: 'Article 5(1)(g)',
    hcmcCitation: 'Article 4(1)',
  },
  {
    id: 'discarded-charging-cable',
    name: 'Discarded charging cable',
    category: 'Reusable and recyclable solid waste',
    hanoiInstruction: 'English summary (not official wording): Coil cable neatly. Bundle with small electronics or hand over to e-waste collection bins located at electronics retailers or scrap recyclers. Contains valuable recyclable copper.',
    hcmcInstruction: 'English summary (not official wording): Store with scrap electronics or place in small e-waste collection boxes at tech supermarkets and mobile stores. Recyclable copper and polymer.',
    hanoiText: 'Thiết bị điện, điện tử gia dụng thải bỏ bao gồm: quạt điện, nồi cơm điện, bàn là, máy sấy tóc, máy vi tính, tivi và các thiết bị gia dụng dùng điện khác.',
    hcmcText: 'Dây sạc, phụ kiện điện tử thải bỏ thuộc nhóm rác điện tử gia dụng, thu gom riêng tái chế kim loại.',
    hanoiCitation: 'Article 5(1)(g)',
    hcmcCitation: 'Article 4(1)',
  },
  {
    id: 'used-mobile-phone',
    name: 'Used mobile phone',
    category: 'Reusable and recyclable solid waste',
    hanoiInstruction: 'English summary (not official wording): A discarded whole mobile phone. Separate from loose chargers or accessories. Hand over to manufacturer EPR take-back points, telecommunications stores, or designated commune e-waste drop-off bins.',
    hcmcInstruction: 'English summary (not official wording): Whole mobile phone. Clear sensitive data and hand over to official take-back points (Việt Nam Tái Chế), electronics retailers (Thế Giới Di Động, FPT Shop), or ward WEEE collection bins.',
    hanoiText: 'Thiết bị điện, điện tử gia dụng thải bỏ bao gồm: quạt điện, nồi cơm điện, bàn là, máy sấy tóc, máy vi tính, tivi và các thiết bị gia dụng dùng điện khác.',
    hcmcText: 'Điện thoại di động cũ thải bỏ: chuyển giao đến các điểm thu hồi thiết bị điện tử của nhà sản xuất hoặc điểm thu gom theo quy định.',
    hanoiCitation: 'Article 5(1)(g)',
    hcmcCitation: 'Article 4(1)',
  },

  // --- Food Waste Stream ---
  {
    id: 'fruit-vegetable-peel',
    name: 'Raw fruit and vegetable peel',
    category: 'Food waste',
    hanoiInstruction: 'English summary (not official wording): Raw fruit and vegetable peels, stems, and trimmings. Drain excess water, store in the designated food waste bag or bin, and set out for daily organic waste collection.',
    hcmcInstruction: 'English summary (not official wording): Drain excess liquid to prevent foul odor. Place into biodegradable bags or the designated organic/food waste container for daily municipal collection.',
    hanoiText: 'Nhóm chất thải thực phẩm bao gồm: thức ăn thừa, thực phẩm hết hạn; rau, củ, quả và phần thải bỏ sau khi sơ chế, chế biến; xác động vật nhỏ, thủy hải sản phát sinh từ hoạt động sinh hoạt.',
    hcmcText: 'Chất thải thực phẩm: thức ăn thừa, rau, củ, quả thải bỏ từ quá trình sơ chế thực phẩm của hộ gia đình.',
    hanoiCitation: 'Article 5(2)',
    hcmcCitation: 'Article 4(2)',
  },
  {
    id: 'fallen-leaves-garden-waste',
    name: 'Fallen leaves and garden waste',
    category: 'Food waste',
    hanoiInstruction: 'English summary (not official wording): Swept dry leaves, wilted plant stems, and soft garden trimmings. Collect in a paper bag or designated food/green waste container for municipal composting. (Large tree branches belong to bulky waste).',
    hcmcInstruction: 'English summary (not official wording): Swept leaves, wilted flowers, and soft garden clippings. Place into the organic/food waste stream for composting or use directly for domestic mulch.',
    hanoiText: 'Nhóm chất thải thực phẩm bao gồm: thức ăn thừa, thực phẩm hết hạn; rau, củ, quả và phần thải bỏ sau khi sơ chế, chế biến; lá cây, hoa rụng từ vườn nhà hoặc cây cảnh sinh hoạt.',
    hcmcText: 'Chất thải thực phẩm và chất thải hữu cơ dễ phân hủy: lá cây, hoa, cỏ từ hoạt động chăm sóc cây cảnh trong khuôn viên gia đình.',
    hanoiCitation: 'Article 5(2)',
    hcmcCitation: 'Article 4(2)',
  },
  {
    id: 'coffee-grounds-tea-leaves',
    name: 'Coffee grounds and loose tea leaves',
    category: 'Food waste',
    hanoiInstruction: 'English summary (not official wording): Spent coffee grounds and loose tea leaves. Drain excess liquid. Highly compostable biowaste; mix into garden soil or place into the food waste bin for municipal composting.',
    hcmcInstruction: 'English summary (not official wording): Drain excess brew liquid. Excellent for home composting or mix directly into the organic/food waste stream for municipal composting.',
    hanoiText: 'Nhóm chất thải thực phẩm bao gồm: thức ăn thừa, thực phẩm hết hạn; rau, củ, quả và phần thải bỏ sau khi sơ chế, chế biến; xác động vật nhỏ, thủy hải sản phát sinh từ hoạt động sinh hoạt.',
    hcmcText: 'Chất thải thực phẩm hữu cơ: bã cà phê, bã trà sau khi pha chế được gom chung vào nhóm chất thải thực phẩm.',
    hanoiCitation: 'Article 5(2)',
    hcmcCitation: 'Article 4(2)',
  },

  // --- Bulky Waste Stream ---
  {
    id: 'discarded-wooden-furniture',
    name: 'Discarded wooden furniture',
    category: 'Bulky waste',
    hanoiInstruction: 'English summary (not official wording): Discarded wooden furniture (wardrobe, table, chairs). Dismantle and reduce volume where feasible. Pay service fee to collection hauler or transport to commune designated bulky transfer point free of charge.',
    hcmcInstruction: 'English summary (not official wording): Dismantle to reduce bulk before transfer. Contract with municipal waste collector for bulky pickup service or transport to district bulky waste transfer station.',
    hanoiText: 'Nhóm chất thải cồng kềnh: Khi có phát sinh phải liên hệ với tổ chức, cá nhân có chức năng thu gom, vận chuyển, xử lý chất thải rắn để thỏa thuận chuyển giao... hoặc tự vận chuyển đến điểm thu gom tập trung do Uỷ ban nhân dân cấp xã quy định với thời gian nhất định và không phải chi trả chi phí.',
    hcmcText: 'Chủ nguồn thải, hộ gia đình, cá nhân có trách nhiệm tháo dỡ, thu gọn, giảm kích thước, thể tích chất thải bỏ đến mức có thể lưu chứa được trong phương tiện thu gom rác trước khi vận chuyển...',
    hanoiCitation: 'Article 7(2)(c)',
    hcmcCitation: 'Article 5(2)',
  },
  {
    id: 'discarded-upholstered-sofa',
    name: 'Discarded upholstered sofa',
    category: 'Bulky waste',
    hanoiInstruction: 'English summary (not official wording): Discarded upholstered couch or armchair. Cannot fit into standard garbage compactor trucks. Schedule paid bulky collection pickup with local sanitation unit or deliver to the commune bulky waste depot.',
    hcmcInstruction: 'English summary (not official wording): Bulky sofa furniture cannot be placed in normal waste bins. Arrange paid pickup with the local garbage collector or dismantle frame and foam before disposal.',
    hanoiText: 'Nhóm chất thải cồng kềnh: Khi có phát sinh phải liên hệ với tổ chức, cá nhân có chức năng thu gom, vận chuyển, xử lý chất thải rắn để thỏa thuận chuyển giao... hoặc tự vận chuyển đến điểm thu gom tập trung do Uỷ ban nhân dân cấp xã quy định...',
    hcmcText: 'Chủ nguồn thải, hộ gia đình, cá nhân có trách nhiệm tháo dỡ, thu gọn, giảm kích thước... Trường hợp không thể tự tháo rã tại nơi phát sinh thì thanh toán chi phí dịch vụ tháo dỡ theo thỏa thuận.',
    hanoiCitation: 'Article 7(2)(c)',
    hcmcCitation: 'Article 5(2)',
  },
  {
    id: 'used-motorbike-tire',
    name: 'Used motorbike tires and inner tubes',
    category: 'Bulky waste',
    hanoiInstruction: 'English summary (not official wording): Worn-out motorbike tires and inner tubes. Oversized vulcanized rubber cannot be compacted in daily trash. Leave with motorbike repair shops for EPR collection or request bulky waste pickup.',
    hcmcInstruction: 'English summary (not official wording): Discarded tires are subject to Extended Producer Responsibility (EPR). Leave at motorbike service centers or arrange bulky collection. Do not burn or dump illegally.',
    hanoiText: 'Nhóm chất thải cồng kềnh: Khi có phát sinh phải liên hệ với tổ chức, cá nhân có chức năng thu gom, vận chuyển, xử lý chất thải rắn để thỏa thuận chuyển giao...',
    hcmcText: 'Chất thải cồng kềnh và cao su kích thước lớn: phối hợp đơn vị thu gom hoặc chuyển giao các cơ sở thu hồi lốp xe theo quy định.',
    hanoiCitation: 'Article 7(2)(c)',
    hcmcCitation: 'Article 5(2)',
  },
  {
    id: 'renovation-rubble-tiles',
    name: 'Minor home renovation rubble and tiles',
    category: 'Bulky waste',
    hanoiInstruction: 'English summary (not official wording): Small amounts of broken bricks, tiles, and renovation rubble (xà bần). Strictly forbidden from domestic garbage compactors. Put into heavy-duty sacks and hire a licensed construction debris hauler.',
    hcmcInstruction: 'English summary (not official wording): Construction rubble (xà bần) must be bagged separately. Strictly prohibited from household waste bins. Contact district licensed construction debris haulers.',
    hanoiText: 'Nhóm chất thải cồng kềnh: Khi có phát sinh phải liên hệ với tổ chức, cá nhân có chức năng thu gom, vận chuyển, xử lý chất thải rắn để thỏa thuận chuyển giao...',
    hcmcText: 'Chất thải rắn phát sinh từ hoạt động cải tạo, sửa chữa công trình xây dựng của hộ gia đình phải được thu gom riêng và chuyển giao cho đơn vị có chức năng thu gom chất thải xây dựng.',
    hanoiCitation: 'Article 7(2)(c)',
    hcmcCitation: 'Article 5(2)',
  },
  {
    id: 'discarded-ceramic-toilet-sink',
    name: 'Discarded ceramic toilet or sink',
    category: 'Bulky waste',
    hanoiInstruction: 'English summary (not official wording): Discarded porcelain toilet bowl or ceramic washbasin. Heavy, fragile sanitary fixture; do not dispose of with normal household garbage. Coordinate with bulky waste hauler or construction waste depot.',
    hcmcInstruction: 'English summary (not official wording): Discarded ceramic sanitary fixtures are bulky demolition waste. Coordinate with specialized construction waste haulers or transport to a licensed transfer station.',
    hanoiText: 'Nhóm chất thải cồng kềnh: Khi có phát sinh phải liên hệ với tổ chức, cá nhân có chức năng thu gom, vận chuyển, xử lý chất thải rắn để thỏa thuận chuyển giao...',
    hcmcText: 'Chất thải cồng kềnh từ thiết bị vệ sinh tháo dỡ: thu gom và chuyển giao theo quy định về chất thải xây dựng, cồng kềnh.',
    hanoiCitation: 'Article 7(2)(c)',
    hcmcCitation: 'Article 5(2)',
  },

  // --- Household Hazardous Waste Stream ---
  {
    id: 'expired-household-medicine',
    name: 'Expired household medicine',
    category: 'Household hazardous waste',
    hanoiInstruction: 'English summary (not official wording): Keep in original blister packs or bottles. Never flush down sinks or toilets to protect groundwater. Place in a separate bag labeled hazardous waste or drop off at local health stations.',
    hcmcInstruction: 'English summary (not official wording): Do not flush down toilets or pour down sinks. Keep in original packaging, label as hazardous waste, and surrender to ward hazardous waste collection points or pharmacy take-back boxes.',
    hanoiText: 'Chất thải nguy hại trong chất thải rắn sinh hoạt bao gồm: bao bì thuốc bảo vệ thực vật, pin, ắc quy thải, bóng đèn huỳnh quang, nhiệt kế thủy ngân, thuốc tây hết hạn sử dụng và các loại hóa chất gia dụng độc hại khác.',
    hcmcText: 'Chất thải nguy hại hộ gia đình: thuốc tây hết hạn sử dụng, dược phẩm tồn đọng phải được lưu giữ riêng và chuyển giao đến điểm thu gom chất thải nguy hại.',
    hanoiCitation: 'Article 5(3)(b)',
    hcmcCitation: 'Article 5(1)(c)',
    isHcmc58: true,
  },
  {
    id: 'aerosol-spray-can',
    name: 'Aerosol spray can',
    category: 'Household hazardous waste',
    hanoiInstruction: 'English summary (not official wording): Pressurized aerosol can. Contains flammable propellant residue and presents severe explosion risks at compactors/incinerators. Do NOT puncture; segregate for hazardous waste collection.',
    hcmcInstruction: 'English summary (not official wording): Pressurized aerosol canisters pose explosion hazards. Do NOT puncture or incinerate at home. Segregate in hazardous waste boxes for municipal hazardous collection.',
    hanoiText: 'Chất thải nguy hại trong chất thải rắn sinh hoạt bao gồm: bao bì thuốc bảo vệ thực vật, pin, ắc quy thải, bóng đèn huỳnh quang, nhiệt kế thủy ngân, bình xịt hóa chất có áp suất, hóa chất gia dụng độc hại khác.',
    hcmcText: 'Chất thải nguy hại hộ gia đình: bình xịt chứa khí nén, hóa chất dễ cháy nổ phải lưu giữ an toàn, chuyển giao đơn vị xử lý có thẩm quyền.',
    hanoiCitation: 'Article 5(3)(b)',
    hcmcCitation: 'Article 5(1)(c)',
    isHcmc58: true,
  },
  {
    id: 'household-pesticide-container',
    name: 'Household pesticide container',
    category: 'Household hazardous waste',
    hanoiInstruction: 'English summary (not official wording): Residual chemical pesticide bottle or packaging. Highly toxic; strictly forbidden from general waste or recycling streams. Store sealed in a hazardous waste box and hand over at designated collection points.',
    hcmcInstruction: 'English summary (not official wording): Pesticide and insecticide containers contain toxic chemical residues. Segregate into hazardous waste containers; transfer to ward hazardous collection points.',
    hanoiText: 'Chất thải nguy hại trong chất thải rắn sinh hoạt bao gồm: bao bì thuốc bảo vệ thực vật, pin, ắc quy thải, bóng đèn huỳnh quang, nhiệt kế thủy ngân, thuốc tây hết hạn sử dụng và các loại hóa chất gia dụng độc hại khác.',
    hcmcText: 'Bao bì thuốc bảo vệ thực vật, hóa chất diệt côn trùng dùng trong sinh hoạt: thu gom riêng vào thùng rác nguy hại, không bỏ lẫn rác sinh hoạt.',
    hanoiCitation: 'Article 5(3)(b)',
    hcmcCitation: 'Article 5(1)(c)',
    isHcmc58: true,
  },
  {
    id: 'used-motor-oil',
    name: 'Used motorbike engine motor oil',
    category: 'Household hazardous waste',
    hanoiInstruction: 'English summary (not official wording): Spent motorbike engine motor oil. Highly hazardous to waterways and soil; strictly forbidden from pouring down drains. Drain into a sealed plastic bottle and deliver to a motorbike service center for EPR collection.',
    hcmcInstruction: 'English summary (not official wording): Spent motor oil is dangerous liquid hazardous waste. Never pour into sewers or storm drains. Drain into a clean bottle with cap tight, and take to a motorbike maintenance shop for EPR collection.',
    hanoiText: 'Chất thải nguy hại trong chất thải rắn sinh hoạt bao gồm: dầu nhớt động cơ thải, bao bì thuốc bảo vệ thực vật, pin, ắc quy thải, bóng đèn huỳnh quang, hóa chất gia dụng độc hại khác.',
    hcmcText: 'Dầu mỡ động cơ thải bỏ từ xe máy sinh hoạt: lưu chứa trong can/bình kín, chuyển giao cho các trạm bảo dưỡng hoặc điểm thu gom chất thải nguy hại.',
    hanoiCitation: 'Article 5(3)(b)',
    hcmcCitation: 'Article 5(1)(c)',
    isHcmc58: true,
  },
  {
    id: 'used-lead-acid-accumulator',
    name: 'Discarded motorbike lead-acid battery',
    category: 'Household hazardous waste',
    hanoiInstruction: 'English summary (not official wording): Motorbike starter lead-acid battery. Contains toxic heavy metal lead and corrosive sulfuric acid electrolyte. Store upright, avoid tipping, and hand over to battery retail shops or hazardous waste collection centers under EPR.',
    hcmcInstruction: 'English summary (not official wording): Contains corrosive sulfuric acid and toxic lead. Keep upright without cracking; return to battery shops under EPR or take to ward hazardous waste collection points.',
    hanoiText: 'các loại pin, ắc quy thải.',
    hcmcText: 'Các loại pin, ắc quy thải: Giữ nguyên hình dạng, không tháo dỡ, chuyển giao đến các điểm thu gom CTNH do UBND cấp huyện quy định.',
    hanoiCitation: 'Article 5(3)(b)',
    hcmcCitation: 'Article 5(1)(c)',
    isHcmc58: true,
  },
  {
    id: 'household-medical-sharps',
    name: 'Household medical sharps and needles',
    category: 'Household hazardous waste',
    hanoiInstruction: 'English summary (not official wording): Used insulin needles and lancets. Puncture and infection biohazard; must be placed into a thick, puncture-proof rigid plastic bottle with lid screwed on tight before handing over to hazardous or medical waste collection.',
    hcmcInstruction: 'English summary (not official wording): Used syringes, needles, and lancets. Store in a rigid, puncture-resistant plastic container with lid screwed tight. Take to commune health station or hazardous collection points.',
    hanoiText: 'Chất thải nguy hại trong chất thải rắn sinh hoạt bao gồm: kim tiêm, vật sắc nhọn y tế gia đình, thuốc tây hết hạn, bóng đèn huỳnh quang, nhiệt kế thủy ngân.',
    hcmcText: 'Kim tiêm, vật sắc nhọn y tế gia đình: chứa trong hộp/bình nhựa cứng chống đâm thủng, bàn giao trạm y tế hoặc điểm thu gom nguy hại.',
    hanoiCitation: 'Article 5(3)(b)',
    hcmcCitation: 'Article 5(1)(c)',
    isHcmc58: true,
  },
  {
    id: 'discarded-nail-polish-bottle',
    name: 'Nail polish and solvent bottle',
    category: 'Household hazardous waste',
    hanoiInstruction: 'English summary (not official wording): Nail polish and solvent bottles contain flammable toxic organic solvents (acetone, toluene, ethyl acetate). Keep tightly closed and dispose of with household hazardous waste.',
    hcmcInstruction: 'English summary (not official wording): Contains volatile chemical solvents. Keep bottle cap tightened and dispose of with household hazardous waste at ward collection stations.',
    hanoiText: 'Chất thải nguy hại trong chất thải rắn sinh hoạt bao gồm: bao bì dung môi, sơn, hóa chất mỹ phẩm độc hại, pin, ắc quy thải, bóng đèn huỳnh quang.',
    hcmcText: 'Chất thải nguy hại hộ gia đình: lọ sơn móng tay, dung môi tẩy sơn chứa hợp chất bay hơi độc hại được gom vào nhóm chất thải nguy hại.',
    hanoiCitation: 'Article 5(3)(b)',
    hcmcCitation: 'Article 5(1)(c)',
    isHcmc58: true,
  },
  {
    id: 'leftover-paint-can',
    name: 'Leftover household paint can',
    category: 'Household hazardous waste',
    hanoiInstruction: 'English summary (not official wording): Leftover wall paint and solvent cans contain volatile organic compounds and chemical biocides. Seal the lid securely and surrender during municipal hazardous waste collection or designated drop-off points.',
    hcmcInstruction: 'English summary (not official wording): Wall paints and wood varnishes contain toxic VOCs and pigments. Seal can firmly to prevent spillage and handover to municipal hazardous waste collection.',
    hanoiText: 'Chất thải nguy hại trong chất thải rắn sinh hoạt bao gồm: vỏ lon sơn dở dang, dung môi, hóa chất gia dụng độc hại khác.',
    hcmcText: 'Sơn thải, vỏ thùng sơn có cặn hóa chất: phân loại là chất thải nguy hại hộ gia đình, bàn giao điểm tiếp nhận quy định.',
    hanoiCitation: 'Article 5(3)(b)',
    hcmcCitation: 'Article 5(1)(c)',
    isHcmc58: true,
  },

  // --- Other Domestic Solid Waste Stream ---
  {
    id: 'large-animal-bone',
    name: 'Large animal bone',
    category: 'Other domestic solid waste',
    hanoiInstruction: 'English summary (not official wording): Large animal bones (pig leg, beef soup bones) are too dense and hard for municipal composting digesters. Place into the standard other/residual domestic waste bag for incineration.',
    hcmcInstruction: 'English summary (not official wording): Large hard animal bones resist standard biowaste shredders and organic composting. Place into the other/residual waste bag for municipal incineration.',
    hanoiText: 'Chất thải rắn sinh hoạt khác bao gồm: các loại chất thải rắn sinh hoạt không thuộc nhóm có khả năng tái sử dụng, tái chế, nhóm chất thải thực phẩm và chất thải nguy hại (bao gồm cả các loại vỏ quả hạt cứng khó phân hủy sinh học như vỏ dừa, vỏ sầu riêng, xương động vật kích thước lớn...).',
    hcmcText: 'Chất thải rắn sinh hoạt khác: xương động vật kích thước lớn không thể ủ phân compost cùng rác thực phẩm mềm.',
    hanoiCitation: 'Article 5(3)(c)',
    hcmcCitation: 'Article 4(3)',
  },
  {
    id: 'disposable-baby-diaper',
    name: 'Disposable baby diaper',
    category: 'Other domestic solid waste',
    hanoiInstruction: 'English summary (not official wording): Used disposable diapers and sanitary pads contain biological waste and absorbent polymers. Wrap tightly using adhesive tabs and seal in a domestic residual waste bag for incineration.',
    hcmcInstruction: 'English summary (not official wording): Fold neatly and secure with tabs. Place into the other/residual waste bag for regular municipal incineration or sanitary landfilling.',
    hanoiText: 'Chất thải rắn sinh hoạt khác bao gồm: tã lót, bỉm, băng vệ sinh, giấy ăn đã qua sử dụng và các chất thải vệ sinh cá nhân khác.',
    hcmcText: 'Chất thải rắn sinh hoạt khác: tã lót, bỉm trẻ em, băng vệ sinh và rác vệ sinh cá nhân không tái chế.',
    hanoiCitation: 'Article 5(3)(c)',
    hcmcCitation: 'Article 4(3)',
  },
  {
    id: 'broken-ceramic-tableware',
    name: 'Broken ceramic dish or shards',
    category: 'Other domestic solid waste',
    hanoiInstruction: 'English summary (not official wording): Broken ceramic bowls, plates, and ceramic shards cannot be melted in glass recycling furnaces. Wrap shards safely in multiple layers of newspaper or cardboard before placing in other/residual waste.',
    hcmcInstruction: 'English summary (not official wording): Broken ceramics cannot be recycled with container glass. Wrap shards securely in paper or cardboard to prevent cuts, and place into other/residual waste.',
    hanoiText: 'Chất thải rắn sinh hoạt khác bao gồm: đồ gốm sứ vỡ, mảnh sành, thủy tinh vỡ không thể tái chế và các chất thải khó phân hủy khác.',
    hcmcText: 'Chất thải rắn sinh hoạt khác: mảnh sành sứ, gốm vỡ được bọc gói cẩn thận tránh gây rách túi rác và thương tích cho công nhân thu gom.',
    hanoiCitation: 'Article 5(3)(c)',
    hcmcCitation: 'Article 4(3)',
  },
  {
    id: 'multi-layer-snack-packaging',
    name: 'Multi-layer snack packaging',
    category: 'Other domestic solid waste',
    hanoiInstruction: 'English summary (not official wording): Metallized composite plastic snack bags (crisps, instant noodle packets) cannot be mechanically recycled in current domestic systems. Place in other/residual waste.',
    hcmcInstruction: 'English summary (not official wording): Multi-layer metallized foil pouches (potato chips, instant snacks) cannot be recycled by local facilities. Dispose of with other/residual waste.',
    hanoiText: 'Chất thải rắn sinh hoạt khác bao gồm: bao bì nhiều lớp, màng ghép kim loại - nhựa khó tái chế trong sinh hoạt thông thường.',
    hcmcText: 'Chất thải rắn sinh hoạt khác: bao bì nhựa ghép nhôm, vỏ bánh kẹo nhiều lớp thuộc nhóm rác sinh hoạt còn lại.',
    hanoiCitation: 'Article 5(3)(c)',
    hcmcCitation: 'Article 4(3)',
  },
  {
    id: 'discarded-motorbike-helmet',
    name: 'Discarded motorbike helmet',
    category: 'Other domestic solid waste',
    hanoiInstruction: 'English summary (not official wording): Damaged motorbike helmets consist of bonded polycarbonate shell, glued EPS foam liner, and nylon webbing that cannot be separated for recycling. Place in other/residual waste.',
    hcmcInstruction: 'English summary (not official wording): Multi-component safety helmets cannot be dismantled for domestic recycling. Place into the other/residual waste stream.',
    hanoiText: 'Chất thải rắn sinh hoạt khác bao gồm: các loại chất thải rắn sinh hoạt không thuộc nhóm có khả năng tái sử dụng, tái chế, nhóm chất thải thực phẩm và chất thải nguy hại...',
    hcmcText: 'Chất thải rắn sinh hoạt khác: mũ bảo hiểm hư hỏng không thể tái chế cơ học, thu gom cùng rác còn lại.',
    hanoiCitation: 'Article 5(3)(c)',
    hcmcCitation: 'Article 4(3)',
  },
  {
    id: 'polystyrene-foam-box',
    name: 'Expanded polystyrene foam box',
    category: 'Other domestic solid waste',
    hanoiInstruction: 'English summary (not official wording): Expanded polystyrene (EPS) takeaway food containers soiled with oil/food cannot be recycled. Place in other/residual waste. (Clean large appliance delivery foam may be reused).',
    hcmcInstruction: 'English summary (not official wording): Soiled EPS food foam boxes belong to other/residual waste. Clean and dry bulk shipping foam may be offered to informal scrap collectors or reused.',
    hanoiText: 'Chất thải rắn sinh hoạt khác bao gồm: hộp xốp đựng thức ăn bẩn, các loại vật liệu xốp dính dầu mỡ không thể tái chế.',
    hcmcText: 'Chất thải rắn sinh hoạt khác: hộp xốp dính dầu mỡ thực phẩm bỏ vào túi rác còn lại.',
    hanoiCitation: 'Article 5(3)(c)',
    hcmcCitation: 'Article 4(3)',
  },
  {
    id: 'single-use-plastic-bag',
    name: 'Single-use plastic carrier bag',
    category: 'Other domestic solid waste',
    hanoiInstruction: 'English summary (not official wording): Soiled, thin single-use plastic carrier bags contaminate recycling sorting machinery. Put soiled bags into other/residual waste for waste-to-energy incineration.',
    hcmcInstruction: 'English summary (not official wording): Thin, dirty plastic bags (túi ni lông) contaminate recycling streams and belong to other/residual waste. Only clean, dry plastic film bundles can be recycled.',
    hanoiText: 'Chất thải rắn sinh hoạt khác bao gồm: túi ni lông mỏng dùng một lần bị bẩn, nhiễm tạp chất hữu cơ.',
    hcmcText: 'Chất thải rắn sinh hoạt khác: túi ni lông dùng một lần nhiễm bẩn thực phẩm, rác khó tái chế.',
    hanoiCitation: 'Article 5(3)(c)',
    hcmcCitation: 'Article 4(3)',
  },
  {
    id: 'worn-out-footwear',
    name: 'Old worn-out shoes and footwear',
    category: 'Other domestic solid waste',
    hanoiInstruction: 'English summary (not official wording): Damaged shoes and footwear with bonded rubber soles, polyurethane foam, and adhesives cannot be recycled in municipal facilities. Place into other/residual waste.',
    hcmcInstruction: 'English summary (not official wording): Severely worn footwear made of composite rubber, synthetic leather, and glue cannot be recycled. Place in other/residual waste.',
    hanoiText: 'Chất thải rắn sinh hoạt khác bao gồm: giày dép cũ hỏng, vật dụng bằng da nhân tạo, cao su tổng hợp không thể tái sử dụng.',
    hcmcText: 'Chất thải rắn sinh hoạt khác: giày dép cũ nát, hư hỏng không thể phục hồi sử dụng.',
    hanoiCitation: 'Article 5(3)(c)',
    hcmcCitation: 'Article 4(3)',
  },
  {
    id: 'used-medical-mask',
    name: 'Used disposable medical mask',
    category: 'Other domestic solid waste',
    hanoiInstruction: 'English summary (not official wording): Disposable polypropylene medical masks. Cut ear loops to prevent wildlife entanglement, wrap securely, and discard into the domestic other/residual waste bag.',
    hcmcInstruction: 'English summary (not official wording): Cut elastic ear loops to prevent animal entanglement, fold mask inward, and dispose of in other/residual waste for sanitary treatment.',
    hanoiText: 'Chất thải rắn sinh hoạt khác bao gồm: khẩu trang y tế dùng một lần phát sinh từ hộ gia đình không có yếu tố dịch tễ lây nhiễm cao.',
    hcmcText: 'Chất thải rắn sinh hoạt khác: khẩu trang y tế sinh hoạt thông thường, bỏ vào túi rác sinh hoạt còn lại buộc kín.',
    hanoiCitation: 'Article 5(3)(c)',
    hcmcCitation: 'Article 4(3)',
  },
  {
    id: 'incense-joss-paper-ash',
    name: 'Incense ash and joss paper ash',
    category: 'Other domestic solid waste',
    hanoiInstruction: 'English summary (not official wording): Incense and joss paper ashes from ancestral altars. Ensure ash is 100% extinguished and cold to prevent trash truck fires. Bag tightly and place into other/residual waste.',
    hcmcInstruction: 'English summary (not official wording): Ensure ritual ashes are completely cooled and extinguished to avoid fire hazards in compactor trucks. Bag tightly and put in other/residual waste.',
    hanoiText: 'Chất thải rắn sinh hoạt khác bao gồm: tàn nhang, tro đốt vàng mã đã nguội hoàn toàn.',
    hcmcText: 'Chất thải rắn sinh hoạt khác: tro vàng mã, tàn hương đã để nguội hoàn toàn, đóng gói kỹ trước khi chuyển giao.',
    hanoiCitation: 'Article 5(3)(c)',
    hcmcCitation: 'Article 4(3)',
  },
]

export function buildRules() {
  const documents = []

  for (const item of REMAINING_ITEMS) {
    // 1. Hanoi Document
    const hanoiDoc = {
      _id: `${item.id}-hanoi`,
      _type: 'disposalRule',
      canonicalItemId: item.id,
      itemName: item.name,
      jurisdiction: 'hanoi',
      disposalCategory: item.category,
      instruction: item.hanoiInstruction,
      validFrom: '2026-01-08',
      validUntil: null,
      sourceReferences: [
        {
          _key: 'hanoi-decision-87',
          _type: 'sourceReference',
          title: HANOI_DECISION_87_REF.title,
          url: HANOI_DECISION_87_REF.url,
          citation: item.hanoiCitation,
          sourceNote: HANOI_DECISION_87_REF.sourceNote,
        },
        HANOI_RECORD_REF,
      ],
      supportingPassages: [
        {
          sourceTitle: HANOI_DECISION_87_REF.title,
          sourceUrl: HANOI_DECISION_87_REF.url,
          sourceCitation: item.hanoiCitation,
          sourceVersion: 'Decision 87/2025/QĐ-UBND (effective 2026-01-08)',
          citation: item.hanoiCitation,
          text: item.hanoiText,
          requires: [
            {
              title: HANOI_RECORD_REF.title,
              url: HANOI_RECORD_REF.url,
              citation: HANOI_RECORD_REF.citation,
            },
          ],
          claimType: 'disposal',
        },
      ],
    }
    documents.push(hanoiDoc)

    // 2. HCMC Document
    const isHazardousHcmc = item.isHcmc58 === true
    const hcmcPrimaryRef = isHazardousHcmc ? HCMC_DECISION_58_REF : HCMC_DECISION_36_REF
    const hcmcReqRef = isHazardousHcmc ? HCMC_RECORD_58_REF : HCMC_RECORD_2736_REF
    const hcmcValidFrom = isHazardousHcmc ? '2025-04-25' : '2025-11-14'
    const hcmcSourceVersion = isHazardousHcmc
      ? 'Decision 58/2025/QĐ-UBND (effective 2025-04-25)'
      : 'Decision 36/2024/QĐ-UBND, cited clauses retained after Decision 2736/QĐ-UBND (effective 2025-11-14)'

    const hcmcDoc = {
      _id: `${item.id}-ho-chi-minh-city`,
      _type: 'disposalRule',
      canonicalItemId: item.id,
      itemName: item.name,
      jurisdiction: 'ho-chi-minh-city',
      disposalCategory: item.category,
      instruction: item.hcmcInstruction,
      validFrom: hcmcValidFrom,
      validUntil: null,
      sourceReferences: [
        {
          _key: isHazardousHcmc ? 'hcmc-decision-58' : 'hcmc-decision-36',
          _type: 'sourceReference',
          title: hcmcPrimaryRef.title,
          url: hcmcPrimaryRef.url,
          citation: item.hcmcCitation,
          sourceNote: hcmcPrimaryRef.sourceNote,
        },
        hcmcReqRef,
      ],
      supportingPassages: [
        {
          sourceTitle: hcmcPrimaryRef.title,
          sourceUrl: hcmcPrimaryRef.url,
          sourceCitation: item.hcmcCitation,
          sourceVersion: hcmcSourceVersion,
          citation: item.hcmcCitation,
          text: item.hcmcText,
          requires: [
            {
              title: hcmcReqRef.title,
              url: hcmcReqRef.url,
              citation: hcmcReqRef.citation,
            },
          ],
          claimType: 'disposal',
        },
      ],
    }
    documents.push(hcmcDoc)
  }

  return documents
}

async function main() {
  const docs = buildRules()
  console.log(`Generated ${docs.length} rules for ${REMAINING_ITEMS.length} items across 2 jurisdictions.`)
  const targetPath = fileURLToPath(new URL('../drafts/all-remaining-disposal-rules.json', import.meta.url))
  await writeFile(targetPath, JSON.stringify(docs, null, 2) + '\n')
  console.log(`Wrote rules to ${targetPath}`)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
