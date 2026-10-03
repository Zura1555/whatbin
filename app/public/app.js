// WhatBin — Frontend Application with Bilingual Support & Stream-based Catalog

const CANONICAL_CATALOG = [
  // 1. Recyclables (Tái chế)
  {
    id: 'pet-plastic-bottle',
    stream: 'recyclables',
    nameEn: 'PET plastic beverage bottle',
    nameVi: 'Chai nhựa PET đựng đồ uống',
    chipEn: 'PET plastic bottle',
    chipVi: 'Chai nhựa PET',
    queryEn: 'a clear PET plastic water bottle',
    queryVi: 'chai nhựa PET đựng nước ngọt hoặc nước suối',
    instructionViHanoi: 'Rút sạch nước thừa, tráng sơ, bẹp chai để giảm thể tích. Bàn giao cho tổ chức, cá nhân thu gom phế liệu (đồng nát/ve chai) hoặc cho vào bao bì/thùng rác tái chế riêng biệt.',
    instructionViHcmc: 'Làm sạch chất lỏng dư, để ráo và ép xẹp chai. Phân loại vào nhóm chất thải tái sử dụng, tái chế bán cho cơ sở thu mua phế liệu (ve chai) hoặc đơn vị thu gom rác tái chế.',
  },
  {
    id: 'corrugated-cardboard-box',
    stream: 'recyclables',
    nameEn: 'Corrugated cardboard box',
    nameVi: 'Thùng bìa carton sóng',
    chipEn: 'Cardboard box',
    chipVi: 'Thùng carton',
    queryEn: 'a corrugated cardboard shipping box',
    queryVi: 'thùng bìa carton sóng đóng gói hàng',
    instructionViHanoi: 'Gỡ băng dính bẩn, làm phẳng, gấp gọn và buộc thành bó khô ráo. Bán phế liệu hoặc chuyển giao cho đơn vị thu gom chất thải tái chế.',
    instructionViHcmc: 'Gấp phẳng thùng carton khô sạch, buộc gọn gàng. Phân loại vào nhóm chất thải có khả năng tái chế để chuyển giao cho người thu mua phế liệu hoặc hệ thống thu gom.',
  },
  {
    id: 'aluminum-beverage-can',
    stream: 'recyclables',
    nameEn: 'Aluminum beverage can',
    nameVi: 'Lon nhôm đồ uống',
    chipEn: 'Aluminum can',
    chipVi: 'Lon nhôm đồ uống',
    queryEn: 'an aluminum beverage beer or soda can',
    queryVi: 'lon nhôm đựng bia hoặc nước ngọt rỗng',
    instructionViHanoi: 'Đổ hết đồ uống thừa, tráng sơ và bóp bẹp lon để tiết kiệm thể tích. Thu gom riêng đưa vào nhóm phế liệu tái chế.',
    instructionViHcmc: 'Đổ sạch chất lỏng thừa, rửa sơ và ép bẹp. Cho vào túi/thùng chứa rác tái chế để bán phế liệu hoặc chuyển giao thu gom tái chế.',
  },
  {
    id: 'glass-bottle-jar',
    stream: 'recyclables',
    nameEn: 'Glass bottle or jar',
    nameVi: 'Chai lọ thủy tinh thực phẩm',
    chipEn: 'Glass bottle / jar',
    chipVi: 'Chai lọ thủy tinh',
    queryEn: 'a clean empty glass beverage bottle or jar',
    queryVi: 'chai lọ thủy tinh rỗng nguyên vẹn đựng thực phẩm',
    instructionViHanoi: 'Trút sạch thực phẩm thừa, tráng sơ, tháo nắp. Giữ nguyên vẹn không làm vỡ để tránh gây thương tích cho công nhân thu gom; đưa vào nhóm chất thải tái chế.',
    instructionViHcmc: 'Rửa sạch cặn bẩn, giữ nguyên vẹn chai lọ thủy tinh (không đập vỡ). Bàn giao cơ sở thu mua phế liệu hoặc phân loại vào nhóm tái chế thu gom riêng.',
  },
  {
    id: 'plastic-bubble-wrap',
    stream: 'recyclables',
    nameEn: 'Plastic bubble wrap packaging',
    nameVi: 'Màng xốp bóng khí bọc hàng',
    chipEn: 'Bubble wrap',
    chipVi: 'Xốp bóng khí',
    queryEn: 'plastic bubble wrap parcel packaging film',
    queryVi: 'màng bọc xốp bóng khí gói bưu phẩm bóp nổ',
    instructionViHanoi: 'Giữ màng xốp sạch và khô, gấp cuộn gọn gàng hoặc tái sử dụng đóng gói hàng. Phân loại cùng nhóm bao bì nhựa mềm tái chế.',
    instructionViHcmc: 'Đảm bảo sạch sẽ, cuộn gọn cùng các loại bao bì màng nhựa mềm để chuyển giao nhóm tái chế hoặc tái sử dụng cho bưu kiện.',
  },
  {
    id: 'used-clothing-textile',
    stream: 'recyclables',
    nameEn: 'Wearable second-hand clothing',
    nameVi: 'Quần áo cũ còn mặc được',
    chipEn: 'Clothing / textiles',
    chipVi: 'Quần áo cũ',
    queryEn: 'clean wearable used clothing and garments',
    queryVi: 'quần áo cũ sạch sẽ còn sử dụng được',
    instructionViHanoi: 'Quần áo cũ sạch, còn giá trị sử dụng nên đem tặng từ thiện, quyên góp vào thùng tiếp nhận cộng đồng hoặc bán cho đơn vị thu mua sợi tái chế. Không bỏ lẫn rác sinh hoạt ướt.',
    instructionViHcmc: 'Phân loại riêng quần áo còn lành lặn để ủng hộ từ thiện hoặc đưa đến các điểm thu nhận tái chế vải sợi. Giữ khô ráo, tách khỏi rác hữu cơ.',
  },
  {
    id: 'beverage-carton-tetra-pak',
    stream: 'recyclables',
    nameEn: 'Aseptic multi-layer beverage carton',
    nameVi: 'Vỏ hộp sữa giấy nhiều lớp (Tetra Pak)',
    chipEn: 'Tetra Pak carton',
    chipVi: 'Vỏ hộp sữa giấy',
    queryEn: 'an empty Tetra Pak milk carton',
    queryVi: 'vỏ hộp sữa tươi giấy nhiều lớp Tetra Pak',
    instructionViHanoi: 'Mở 4 góc tai hộp, ép bẹp, tráng nước và cắm ống hút vào trong (hoặc tháo riêng). Thu gom thành xấp khô ráo đưa vào điểm thu gom vỏ hộp giấy tái chế.',
    instructionViHcmc: 'Gấp dẹp hộp sữa giấy, tráng sạch để tránh mùi chua lên men. Gom thành bó nộp cho các điểm thu gom vỏ hộp sữa của trường học, siêu thị hoặc đơn vị tái chế giấy.',
  },
  {
    id: 'discarded-laptop',
    stream: 'recyclables',
    nameEn: 'Discarded laptop computer',
    nameVi: 'Máy tính xách tay / Laptop cũ',
    chipEn: 'Laptop computer',
    chipVi: 'Laptop / Máy tính cũ',
    queryEn: 'a complete discarded laptop computer',
    queryVi: 'máy tính xách tay laptop cũ hỏng cả máy',
    instructionViHanoi: 'Sao lưu và xóa sạch dữ liệu cá nhân nếu còn khởi động được. Bàn giao nguyên chiếc cho điểm thu hồi thiết bị điện tử của nhà sản xuất (EPR) hoặc cơ sở thu mua đồ điện tử.',
    instructionViHcmc: 'Bảo vệ dữ liệu cá nhân trước khi bỏ. Đưa tới các điểm thu hồi rác điện tử (Việt Nam Tái Chế), chuỗi cửa hàng công nghệ hoặc đại lý thu hồi theo quy chuẩn.',
  },
  {
    id: 'discarded-electric-fan',
    stream: 'recyclables',
    nameEn: 'Discarded electric fan',
    nameVi: 'Quạt điện gia đình cũ hỏng',
    chipEn: 'Electric fan',
    chipVi: 'Quạt điện cũ',
    queryEn: 'a discarded household electric fan',
    queryVi: 'quạt điện đứng hoặc quạt treo tường cũ hỏng',
    instructionViHanoi: 'Rút điện, vệ sinh bụi thô. Bàn giao hoặc bán cho người thu gom phế liệu hoặc các chương trình thu hồi thiết bị điện gia dụng cũ hỏng để tái chế kim loại và nhựa.',
    instructionViHcmc: 'Thiết bị điện gia dụng chứa linh kiện kim loại và động cơ đồng có giá trị cao. Tách riêng khỏi rác thông thường và bán phế liệu (ve chai) hoặc đại lý thu hồi.',
  },
  {
    id: 'discarded-microwave-oven',
    stream: 'recyclables',
    nameEn: 'Discarded microwave oven',
    nameVi: 'Lò vi sóng cũ hỏng',
    chipEn: 'Microwave oven',
    chipVi: 'Lò vi sóng cũ',
    queryEn: 'a discarded countertop microwave oven',
    queryVi: 'lò vi sóng cũ hỏng không còn dùng được',
    instructionViHanoi: 'Rút phích cắm, lau sạch dầu mỡ bên trong. Chuyển giao cơ sở thu mua đồ điện tử hoặc điểm thu gom thiết bị điện cũ. Không đập phá đèn vi sóng chân không.',
    instructionViHcmc: 'Tách riêng khỏi rác sinh hoạt hàng ngày. Đưa đến các điểm tiếp nhận thiết bị điện tử thải bỏ, cơ sở sửa chữa đồ điện hoặc bán cho cơ sở phế liệu chuyên thu mua WEEE.',
  },
  {
    id: 'discarded-charging-cable',
    stream: 'recyclables',
    nameEn: 'Discarded charging cable',
    nameVi: 'Dây cáp sạc điện thoại / USB',
    chipEn: 'Charging cable',
    chipVi: 'Dây cáp sạc',
    queryEn: 'a discarded phone charging cable or cord',
    queryVi: 'dây cáp sạc điện thoại dây USB cũ đứt hỏng',
    instructionViHanoi: 'Cuộn gọn dây cáp. Gom chung vào hộp rác điện tử nhỏ tại các cửa hàng di động hoặc bán phế liệu tái chế kim loại đồng.',
    instructionViHcmc: 'Gom cùng các phụ kiện điện tử nhỏ để đưa vào thùng thu gom rác điện tử tại hệ thống siêu thị điện máy hoặc cơ sở tái chế kim loại.',
  },
  {
    id: 'used-mobile-phone',
    stream: 'recyclables',
    nameEn: 'Used mobile phone',
    nameVi: 'Điện thoại di động cũ hỏng',
    chipEn: 'Mobile phone',
    chipVi: 'Điện thoại cũ',
    queryEn: 'a discarded whole mobile phone',
    queryVi: 'điện thoại di động cũ hỏng nguyên chiếc',
    instructionViHanoi: 'Điện thoại di động nguyên chiếc. Tháo sim, xóa dữ liệu nếu có thể. Chuyển giao các điểm thu hồi thiết bị điện tử của nhà sản xuất (EPR) hoặc điểm thu hồi cấp xã/phường.',
    instructionViHcmc: 'Điện thoại cũ nguyên chiếc. Mang đến các điểm thu gom rác điện tử (Việt Nam Tái Chế), chuỗi cửa hàng bán lẻ (Thế Giới Di Động, FPT) để xử lý an toàn theo quy định.',
  },

  // 2. Food waste (Thực phẩm)
  {
    id: 'cooked-food-scrap',
    stream: 'food',
    nameEn: 'Cooked food scrap',
    nameVi: 'Thức ăn thừa đã nấu chín',
    chipEn: 'Cooked food scraps',
    chipVi: 'Thức ăn thừa',
    queryEn: 'cooked food scraps, rice and noodles leftover',
    queryVi: 'thức ăn thừa cơm canh sau bữa ăn',
    instructionViHanoi: 'Gạn bỏ tối đa nước thừa, bảo quản trong túi hoặc thùng rác thực phẩm riêng biệt và chuyển giao cho đơn vị thu gom rác hữu cơ hàng ngày.',
    instructionViHcmc: 'Để ráo nước nhằm giảm thiểu mùi hôi và khối lượng. Cho vào túi tự hủy sinh học hoặc thùng rác hữu cơ riêng để bàn giao cho công nhân thu gom rác thực phẩm.',
  },
  {
    id: 'fruit-vegetable-peel',
    stream: 'food',
    nameEn: 'Raw fruit and vegetable peel',
    nameVi: 'Vỏ trái cây, rau củ quả',
    chipEn: 'Fruit & vegetable peels',
    chipVi: 'Vỏ rau củ quả',
    queryEn: 'soft raw fruit and vegetable peels and trimmings',
    queryVi: 'vỏ trái cây cuống rau củ quả gọt vỏ',
    instructionViHanoi: 'Gọt bỏ phần hư thối, gạn khô ráo. Cho vào nhóm chất thải thực phẩm để ủ phân compost hoặc xử lý sinh học. Không lẫn vỏ dừa cứng hay túi ni lông.',
    instructionViHcmc: 'Chất thải hữu cơ dễ phân hủy. Gom vào túi chứa rác thực phẩm, loại bỏ bao bì ni lông bọc ngoài trước khi bỏ vào thùng.',
  },
  {
    id: 'fallen-leaves-garden-waste',
    stream: 'food',
    nameEn: 'Fallen leaves and garden waste',
    nameVi: 'Lá cây rụng, cành lá vườn nhà',
    chipEn: 'Garden leaves & waste',
    chipVi: 'Lá cây rụng',
    queryEn: 'swept fallen dry leaves and wilted flowers',
    queryVi: 'lá cây rụng hoa héo quét dọn vườn',
    instructionViHanoi: 'Lá cây, hoa rụng quét dọn vườn nhà lượng nhỏ cho vào nhóm chất thải thực phẩm để ủ compost. (Cành cây lớn, thân cây chặt hạ thuộc nhóm rác cồng kềnh).',
    instructionViHcmc: 'Lá cây, cỏ dại từ sân vườn có thể ủ gốc cây làm mùn hữu cơ hoặc bỏ vào nhóm rác hữu cơ dễ phân hủy thu gom định kỳ.',
  },
  {
    id: 'coffee-grounds-tea-leaves',
    stream: 'food',
    nameEn: 'Coffee grounds and loose tea leaves',
    nameVi: 'Bã cà phê, bã trà sau khi pha',
    chipEn: 'Coffee / tea grounds',
    chipVi: 'Bã cà phê & trà',
    queryEn: 'spent coffee grounds from filter and loose tea leaves',
    queryVi: 'bã cà phê pha phin và bã trà xanh',
    instructionViHanoi: 'Gạn sạch nước. Rác hữu cơ vi sinh rất tốt cho đất, có thể bón trực tiếp cho cây cảnh hoặc bỏ chung vào thùng chất thải thực phẩm.',
    instructionViHcmc: 'Bã cà phê, bã trà sau khi pha chế được gom vào nhóm chất thải thực phẩm hoặc tận dụng làm phân bón hữu cơ cho cây trồng tại gia đình.',
  },

  // 3. Hazardous waste (Nguy hại)
  {
    id: 'used-household-battery',
    stream: 'hazardous',
    nameEn: 'Used household battery',
    nameVi: 'Pin tiểu gia dụng (AA, AAA)',
    chipEn: 'AA / AAA battery',
    chipVi: 'Pin tiểu AA/AAA',
    queryEn: 'an intact used household AA or AAA battery cell',
    queryVi: 'pin tiểu gia dụng AA AAA đã qua sử dụng',
    instructionViHanoi: 'Giữ nguyên hình dạng, dán băng dính 2 đầu cực. Bỏ vào thùng thu gom pin cũ tại UBND phường, siêu thị, trường học. Nghiêm cấm vứt lẫn rác sinh hoạt.',
    instructionViHcmc: 'Chứa kim loại nặng độc hại. Dán băng dính vào các cực pin, gom vào hộp riêng và giao cho điểm thu gom chất thải nguy hại hoặc thùng thu hồi pin tại các siêu thị.',
  },
  {
    id: 'used-lithium-ion-battery',
    stream: 'hazardous',
    nameEn: 'Used rechargeable lithium-ion battery',
    nameVi: 'Pin sạc lithium-ion rời',
    chipEn: 'Li-ion battery',
    chipVi: 'Pin sạc Li-ion',
    queryEn: 'a standalone used rechargeable lithium-ion battery cell',
    queryVi: 'pin sạc lithium-ion rời tháo khỏi máy',
    instructionViHanoi: 'Nguy cơ cháy nổ cao. Dán kín 2 đầu cực bằng băng dính cách điện, bảo quản nơi khô mát và giao cho điểm tiếp nhận chất thải nguy hại được cấp phép.',
    instructionViHcmc: 'Pin lithium-ion rời có nguy cơ bắt lửa khi bị chèn ép. Dán kín các cực điện, cho vào hộp bảo vệ và giao cho điểm thu hồi CTNH cấp quận/huyện.',
  },
  {
    id: 'used-power-bank',
    stream: 'hazardous',
    nameEn: 'Used power bank',
    nameVi: 'Pin sạc dự phòng cũ hỏng',
    chipEn: 'Power bank',
    chipVi: 'Sạc dự phòng',
    queryEn: 'a complete discarded portable power bank',
    queryVi: 'cục sạc dự phòng pin dự phòng hỏng',
    instructionViHanoi: 'Bảo quản nguyên vỏ sạc dự phòng, không cạy mở vỏ pin. Chuyển giao tới điểm thu hồi rác điện tử/chất thải nguy hại chuyên biệt.',
    instructionViHcmc: 'Chứa cell pin lithium dung lượng lớn. Không đập vỡ, giao nguyên khối cho các điểm tiếp nhận rác điện tử (Việt Nam Tái Chế) hoặc cửa hàng công nghệ.',
  },
  {
    id: 'used-fluorescent-lamp',
    stream: 'hazardous',
    nameEn: 'Used fluorescent lamp',
    nameVi: 'Bóng đèn huỳnh quang / bóng tuýp',
    chipEn: 'Fluorescent lamp',
    chipVi: 'Bóng đèn huỳnh quang',
    queryEn: 'a household fluorescent tube or compact bulb',
    queryVi: 'bóng đèn huỳnh quang tuýp vỡ hoặc cũ',
    instructionViHanoi: 'Chứa hơi thủy ngân độc hại. Giữ nguyên vẹn, bọc giấy báo hoặc cho vào vỏ hộp giấy tránh vỡ. Mang đến điểm thu gom chất thải nguy hại của phường/xã.',
    instructionViHcmc: 'Bóng đèn huỳnh quang hỏng phải bọc kỹ, tuyệt đối tránh làm vỡ phát tán thủy ngân. Chuyển giao tại các điểm thu gom chất thải nguy hại hộ gia đình.',
  },
  {
    id: 'used-mercury-thermometer',
    stream: 'hazardous',
    nameEn: 'Used mercury thermometer',
    nameVi: 'Nhiệt kế thủy ngân vỡ / cũ',
    chipEn: 'Mercury thermometer',
    chipVi: 'Nhiệt kế thủy ngân',
    queryEn: 'a household mercury glass thermometer',
    queryVi: 'nhiệt kế thủy ngân y tế bị vỡ hoặc cũ',
    instructionViHanoi: 'Thủy ngân thể lỏng cực độc. Nếu vỡ: dùng que gạt nhẹ giọt thủy ngân vào lọ kín, rắc bột lưu huỳnh nếu có. Bàn giao điểm thu gom chất thải nguy hại hoặc trạm y tế.',
    instructionViHcmc: 'Đặt trong lọ thủy tinh hoặc hộp nhựa kín nắp. Không đổ vào cống thoát nước hay thùng rác sinh hoạt. Bàn giao cho trạm y tế phường hoặc điểm thu gom nguy hại.',
  },
  {
    id: 'expired-household-medicine',
    stream: 'hazardous',
    nameEn: 'Expired household medicine',
    nameVi: 'Thuốc tây gia đình hết hạn',
    chipEn: 'Expired medicine',
    chipVi: 'Thuốc tây hết hạn',
    queryEn: 'expired prescription or OTC medicine pills',
    queryVi: 'thuốc tây vỉ thuốc kháng sinh hết hạn',
    instructionViHanoi: 'Để nguyên trong bao bì vỉ hoặc lọ nguyên gốc. Tuyệt đối không xả xuống bồn cầu hay bồn rửa chén. Đưa vào túi ghi chữ CTNH nộp tại trạm y tế phường.',
    instructionViHcmc: 'Không đổ xuống cống thoát nước để bảo vệ nguồn nước ngầm. Giữ nguyên bao bì thuốc và gửi lại các điểm thu gom thuốc hết hạn tại nhà thuốc hoặc trạm y tế.',
  },
  {
    id: 'aerosol-spray-can',
    stream: 'hazardous',
    nameEn: 'Aerosol spray can',
    nameVi: 'Bình xịt khí nén (xịt muỗi, xịt tóc)',
    chipEn: 'Aerosol spray can',
    chipVi: 'Bình xịt khí nén',
    queryEn: 'a pressurized aerosol spray can insecticide or hairspray',
    queryVi: 'bình xịt côn trùng khí nén xịt tóc',
    instructionViHanoi: 'Bình chứa khí nén dễ nổ khi gặp nhiệt hoặc bị xe rác ép. Không đục thủng, không đốt. Tách riêng cho vào nhóm chất thải nguy hại.',
    instructionViHcmc: 'Bình xịt khí áp suất có nguy cơ nổ cao trong xe cuốn ép rác. Không chọc thủng; chuyển giao cho đơn vị thu gom chất thải nguy hại.',
  },
  {
    id: 'household-pesticide-container',
    stream: 'hazardous',
    nameEn: 'Household pesticide container',
    nameVi: 'Chai lọ thuốc diệt côn trùng / mối',
    chipEn: 'Pesticide container',
    chipVi: 'Vỏ chai thuốc diệt côn trùng',
    queryEn: 'a bottle or container that held household pesticide',
    queryVi: 'vỏ chai lọ thuốc diệt mối muỗi gia đình',
    instructionViHanoi: 'Bao bì dính cặn hóa chất cực độc. Đóng chặt nắp, không xúc rửa ra nguồn nước sinh hoạt. Bỏ vào thùng rác nguy hại có nắp đậy tại địa phương.',
    instructionViHcmc: 'Thuộc nhóm chất thải nguy hại độc tính cao. Không tái sử dụng đựng dung dịch khác; giao trực tiếp cho điểm tiếp nhận chất thải nguy hại.',
  },
  {
    id: 'used-motor-oil',
    stream: 'hazardous',
    nameEn: 'Used motorbike engine motor oil',
    nameVi: 'Dầu nhớt xe máy thải',
    chipEn: 'Motorbike engine oil',
    chipVi: 'Dầu nhớt xe máy thải',
    queryEn: 'spent motorbike engine motor oil drained from bike',
    queryVi: 'dầu nhớt xe máy thải ra sau khi thay',
    instructionViHanoi: 'Dầu nhớt đen ô nhiễm nghiêm trọng đất và nước. Chứa vào can/chai nhựa đóng chặt nắp và bàn giao cho tiệm sửa xe máy để thu hồi tái chế theo EPR.',
    instructionViHcmc: 'Tuyệt đối không đổ xuống cống rãnh. Chứa trong bình kín, gửi lại các tiệm sửa xe hoặc điểm thu gom chất thải nguy hại để xử lý tiêu hủy theo quy định.',
  },
  {
    id: 'used-lead-acid-accumulator',
    stream: 'hazardous',
    nameEn: 'Discarded motorbike lead-acid battery',
    nameVi: 'Bình ắc quy xe máy hỏng',
    chipEn: 'Lead-acid accumulator',
    chipVi: 'Ắc quy xe máy hỏng',
    queryEn: 'a discarded motorbike 12V lead-acid battery accumulator',
    queryVi: 'bình ắc quy chì xe máy cũ hỏng',
    instructionViHanoi: 'Chứa axit sunfuric ăn mòn và kim loại nặng chì. Đặt thẳng đứng, tránh đổ ngã rò rỉ dung dịch. Giao nộp cho đại lý bán ắc quy (EPR) hoặc điểm thu hồi CTNH.',
    instructionViHcmc: 'Ắc quy chì axit phải giữ nguyên trạng, không cạy phá bản cực. Bàn giao cho các cửa hàng thu đổi ắc quy hoặc điểm thu gom CTNH cấp quận/huyện.',
  },
  {
    id: 'household-medical-sharps',
    stream: 'hazardous',
    nameEn: 'Household medical sharps and needles',
    nameVi: 'Kim tiêm, vật sắc nhọn y tế gia đình',
    chipEn: 'Medical sharps / needles',
    chipVi: 'Kim tiêm y tế gia đình',
    queryEn: 'used diabetic insulin pen needles or lancets',
    queryVi: 'kim tiêm tiểu đường kim lấy máu y tế',
    instructionViHanoi: 'Nguy cơ đâm thủng và lây nhiễm cao. Đặt vào chai nhựa cứng dày nắp vặn chặt (chai nước giặt/nước ngọt). Ghi rõ nhãn và nộp tại trạm y tế phường.',
    instructionViHcmc: 'Chứa trong bình nhựa cứng có nắp đậy kín chống đâm xuyên. Không bỏ vào túi nilon thông thường. Bàn giao cho trạm y tế hoặc điểm thu gom nguy hại.',
  },
  {
    id: 'discarded-nail-polish-bottle',
    stream: 'hazardous',
    nameEn: 'Nail polish and solvent bottle',
    nameVi: 'Lọ sơn móng tay, nước tẩy sơn',
    chipEn: 'Nail polish bottle',
    chipVi: 'Lọ sơn móng tay',
    queryEn: 'a bottle containing nail polish or acetone remover',
    queryVi: 'lọ sơn móng tay axeton tẩy móng',
    instructionViHanoi: 'Chứa dung môi hữu cơ bay hơi và dễ cháy (axeton, butyl axetat). Vặn chặt nắp lọ và bỏ vào thùng rác nguy hại hộ gia đình.',
    instructionViHcmc: 'Chất thải nguy hại chứa dung môi hữu cơ độc hại. Giữ kín nắp để tránh bay hơi hóa chất và chuyển giao tại điểm tiếp nhận CTNH của phường.',
  },
  {
    id: 'leftover-paint-can',
    stream: 'hazardous',
    nameEn: 'Leftover household paint can',
    nameVi: 'Lon sơn tường còn thừa',
    chipEn: 'Leftover paint can',
    chipVi: 'Lon sơn tường thừa',
    queryEn: 'a metal can or bucket with leftover wall paint',
    queryVi: 'thùng lon sơn tường còn thừa cặn sơn',
    instructionViHanoi: 'Đậy chặt nắp thùng/lon để tránh rò rỉ sơn ra môi trường. Chuyển giao vào các đợt thu gom chất thải nguy hại của địa phương.',
    instructionViHcmc: 'Sơn chứa hợp chất hữu cơ bay hơi VOC và phụ gia kim loại. Đậy chặt nắp và bàn giao cho đơn vị thu gom chất thải nguy hại.',
  },

  // 4. Bulky waste (Cồng kềnh)
  {
    id: 'old-mattress',
    stream: 'bulky',
    nameEn: 'Old mattress',
    nameVi: 'Đệm lò xo / đệm mút cũ',
    chipEn: 'Old mattress',
    chipVi: 'Đệm cũ',
    queryEn: 'an old mattress being discarded',
    queryVi: 'đệm nằm đệm mút lò xo cũ bỏ đi',
    instructionViHanoi: 'Chất thải cồng kềnh. Liên hệ đơn vị thu gom rác trên địa bàn để thỏa thuận trả giá dịch vụ lấy tận nơi, hoặc tự vận chuyển đến điểm tập kết rác cồng kềnh của xã/phường (miễn phí).',
    instructionViHcmc: 'Chất thải cồng kềnh. Hộ gia đình tự tháo rã giảm kích thước nếu có thể, hoặc liên hệ đơn vị thu gom ký hợp đồng thu gom trả phí dịch vụ vận chuyển riêng.',
  },
  {
    id: 'discarded-wooden-furniture',
    stream: 'bulky',
    nameEn: 'Discarded wooden furniture',
    nameVi: 'Bàn ghế, tủ gỗ gia dụng cũ',
    chipEn: 'Wooden furniture',
    chipVi: 'Đồ gỗ cũ (bàn ghế tủ)',
    queryEn: 'discarded wooden table, chair, wardrobe, or desk',
    queryVi: 'bàn ghế gỗ tủ quần áo gỗ cũ hỏng',
    instructionViHanoi: 'Tháo dỡ thành các tấm ván phẳng để giảm thể tích lưu chứa. Thỏa thuận chi trả phí thu gom với đơn vị vệ sinh môi trường hoặc chở ra điểm tập kết rác cồng kềnh của phường.',
    instructionViHcmc: 'Tháo rã thu gọn thể tích trước khi chuyển giao. Thỏa thuận chi phí vận chuyển cồng kềnh với đơn vị thu gom rác địa phương hoặc chở tới trạm trung chuyển.',
  },
  {
    id: 'discarded-upholstered-sofa',
    stream: 'bulky',
    nameEn: 'Discarded upholstered sofa',
    nameVi: 'Ghế sofa đệm mút cũ',
    chipEn: 'Upholstered sofa',
    chipVi: 'Sofa đệm cũ',
    queryEn: 'a discarded upholstered sofa or armchair',
    queryVi: 'ghế sofa salon đệm mút rách cũ',
    instructionViHanoi: 'Không nhét vào thùng rác gia đình hay vứt lề đường. Liên hệ đơn vị môi trường thỏa thuận giá thu gom hoặc mang tới điểm tập kết cồng kềnh của UBND phường.',
    instructionViHcmc: 'Sofa kích thước lớn không thể ép trong xe cuốn ép thông thường. Liên hệ đường dây nóng vệ sinh môi trường quận để đăng ký dịch vụ thu gom cồng kềnh có trả phí.',
  },
  {
    id: 'used-motorbike-tire',
    stream: 'bulky',
    nameEn: 'Used motorbike tires and inner tubes',
    nameVi: 'Lốp, săm xe máy cũ hỏng',
    chipEn: 'Motorbike tires',
    chipVi: 'Lốp, săm xe máy cũ',
    queryEn: 'worn rubber motorbike tires and inner tubes',
    queryVi: 'lốp xe máy săm xe máy mòn rách',
    instructionViHanoi: 'Lốp cao su kích thước lớn không được bỏ lẫn vào rác sinh hoạt đốt thông thường. Gửi lại các tiệm sửa xe máy (EPR) hoặc gọi dịch vụ thu gom rác cồng kềnh.',
    instructionViHcmc: 'Sản phẩm thuộc trách nhiệm tái chế của nhà sản xuất (EPR). Chuyển giao các tiệm bảo dưỡng xe máy hoặc dịch vụ thu gom rác cồng kềnh. Tuyệt đối không tự ý đốt.',
  },
  {
    id: 'renovation-rubble-tiles',
    stream: 'bulky',
    nameEn: 'Minor home renovation rubble and tiles',
    nameVi: 'Xà bần, gạch vỡ sửa nhà nhỏ',
    chipEn: 'Rubble & broken tiles',
    chipVi: 'Xà bần / gạch vỡ',
    queryEn: 'minor home renovation rubble, bricks, and ceramic tiles',
    queryVi: 'xà bần vữa gạch men vỡ sửa chữa nhà',
    instructionViHanoi: 'Xà bần, gạch vữa sửa chữa nhà cửa. Nghiêm cấm vứt vào xe rác sinh hoạt. Đóng bao tải dứa chắc chắn và thuê xe chuyên dùng chở rác xây dựng vận chuyển.',
    instructionViHcmc: 'Chất thải rắn xây dựng (xà bần) phải đóng bao riêng. Không bỏ chung vào thùng rác sinh hoạt. Liên hệ công ty dịch vụ công ích quận hoặc đơn vị chở xà bần chuyên trách.',
  },
  {
    id: 'discarded-ceramic-toilet-sink',
    stream: 'bulky',
    nameEn: 'Discarded ceramic toilet or sink',
    nameVi: 'Bồn cầu, chậu rửa sứ cũ hỏng',
    chipEn: 'Ceramic toilet / sink',
    chipVi: 'Bồn cầu / chậu rửa sứ',
    queryEn: 'a discarded ceramic porcelain toilet bowl or washbasin sink',
    queryVi: 'bồn cầu sứ lavabo chậu rửa mặt vỡ cũ',
    instructionViHanoi: 'Thiết bị vệ sinh bằng sứ tháo dỡ thuộc nhóm rác cồng kềnh / phế thải xây dựng. Chở đến điểm tập kết vật liệu xây dựng hoặc trả phí đơn vị vận chuyển chuyên dụng.',
    instructionViHcmc: 'Thiết bị sứ vệ sinh nặng và dễ vỡ. Phân loại vào nhóm chất thải xây dựng và cồng kềnh; liên hệ dịch vụ thu gom để chở đến trạm tiếp nhận theo quy định.',
  },

  // 5. Other domestic solid waste (Rác khác / Rác còn lại)
  {
    id: 'discarded-coconut-shell',
    stream: 'other',
    nameEn: 'Discarded coconut shell',
    nameVi: 'Vỏ dừa khô / vỏ dừa tươi',
    chipEn: 'Coconut shell',
    chipVi: 'Vỏ dừa',
    queryEn: 'a discarded hard coconut shell or husk',
    queryVi: 'vỏ dừa khô vỏ quả dừa uống nước',
    instructionViHanoi: 'Vỏ dừa xơ cứng, khó phân hủy sinh học và làm kẹt máy nghiền compost. Phân loại vào nhóm chất thải rắn sinh hoạt khác (rác còn lại) để đưa vào nhà máy đốt rác phát điện.',
    instructionViHcmc: 'Xơ dừa dai và vỏ sọ cứng không ủ phân compost thông thường được. Bỏ vào túi chứa nhóm chất thải rắn sinh hoạt còn lại để mang đi đốt rác phát điện.',
  },
  {
    id: 'large-animal-bone',
    stream: 'other',
    nameEn: 'Large animal bone',
    nameVi: 'Xương động vật kích thước lớn (bò, heo)',
    chipEn: 'Large animal bone',
    chipVi: 'Xương động vật lớn',
    queryEn: 'a large hard animal bone pig or beef soup bone',
    queryVi: 'xương bò xương ống lợn nấu canh',
    instructionViHanoi: 'Xương ống heo, xương bò kích thước lớn và cứng. Bỏ vào nhóm chất thải rắn sinh hoạt khác (rác còn lại) để đốt. Không bỏ vào thùng ủ rác hữu cơ mềm.',
    instructionViHcmc: 'Xương động vật kích thước lớn không thể nghiền nhỏ ủ phân compost cùng rác thực phẩm mềm. Phân loại vào nhóm rác sinh hoạt còn lại.',
  },
  {
    id: 'disposable-baby-diaper',
    stream: 'other',
    nameEn: 'Disposable baby diaper',
    nameVi: 'Tã bỉm trẻ em, băng vệ sinh',
    chipEn: 'Disposable diaper',
    chipVi: 'Tã bỉm trẻ em',
    queryEn: 'a used disposable baby diaper or sanitary pad',
    queryVi: 'tã bỉm bỉm trẻ em đã qua sử dụng',
    instructionViHanoi: 'Gấp gọn, dán kín bằng tai dán dính và cho vào túi rác sinh hoạt khác (rác còn lại) buộc chặt trước khi chuyển giao đốt rác xử lý triệt để.',
    instructionViHcmc: 'Chất thải vệ sinh cá nhân khó phân hủy. Cuộn gọn, bỏ vào túi rác sinh hoạt còn lại để thu gom đưa vào nhà máy xử lý nhiệt hoặc chôn lấp hợp vệ sinh.',
  },
  {
    id: 'broken-ceramic-tableware',
    stream: 'other',
    nameEn: 'Broken ceramic dish or shards',
    nameVi: 'Mảnh bát đĩa gốm sứ vỡ',
    chipEn: 'Broken ceramic dish',
    chipVi: 'Bát đĩa sứ vỡ',
    queryEn: 'broken ceramic porcelain bowl dish or shards',
    queryVi: 'bát đĩa sứ chén sành bị rơi vỡ',
    instructionViHanoi: 'Gốm sứ không nung chảy tái chế như thủy tinh được. Gói nhiều lớp giấy báo hoặc bìa carton để tránh đâm rách túi rác và gây thương tích cho công nhân, rồi bỏ vào rác còn lại.',
    instructionViHcmc: 'Mảnh sành sứ vỡ không thuộc nhóm tái chế thủy tinh. Bọc lót cẩn thận bằng giấy báo dày và cho vào nhóm chất thải rắn sinh hoạt còn lại.',
  },
  {
    id: 'multi-layer-snack-packaging',
    stream: 'other',
    nameEn: 'Multi-layer snack packaging',
    nameVi: 'Vỏ bao bì bánh kẹo, vỏ bim bim',
    chipEn: 'Snack packaging',
    chipVi: 'Vỏ gói bim bim / bánh kẹo',
    queryEn: 'multi-layer foil snack bag or instant noodle wrapper',
    queryVi: 'vỏ gói bim bim gói mì tôm tráng bạc',
    instructionViHanoi: 'Bao bì màng ghép nhôm - nhựa nhiều lớp hiện chưa có quy trình tái chế cơ học hiệu quả. Bỏ vào túi chất thải rắn sinh hoạt khác (rác còn lại) để đốt rác phát điện.',
    instructionViHcmc: 'Bao bì phức hợp nhựa ghép kim loại bỏ vào nhóm rác sinh hoạt còn lại để thu gom và xử lý tại các nhà máy đốt rác phát điện.',
  },
  {
    id: 'discarded-motorbike-helmet',
    stream: 'other',
    nameEn: 'Discarded motorbike helmet',
    nameVi: 'Mũ bảo hiểm xe máy hỏng',
    chipEn: 'Motorbike helmet',
    chipVi: 'Mũ bảo hiểm hỏng',
    queryEn: 'a damaged or expired motorcycle protective helmet',
    queryVi: 'mũ bảo hiểm xe máy cũ hỏng nứt',
    instructionViHanoi: 'Mũ bảo hiểm gồm vỏ nhựa cứng gắn keo chặt với xốp EPS giảm chấn và quai vải, không thể tách rời tái chế. Bỏ vào nhóm chất thải rắn sinh hoạt khác.',
    instructionViHcmc: 'Vật phẩm đa vật liệu gắn chết không thể phân loại cơ học. Cho vào nhóm chất thải sinh hoạt còn lại để thu gom tiêu hủy hợp chuẩn.',
  },
  {
    id: 'polystyrene-foam-box',
    stream: 'other',
    nameEn: 'Expanded polystyrene foam box',
    nameVi: 'Hộp xốp đựng cơm, thùng xốp',
    chipEn: 'Foam takeaway box',
    chipVi: 'Hộp xốp đựng cơm',
    queryEn: 'a white expanded polystyrene EPS takeout food container',
    queryVi: 'hộp cơm xốp dính dầu mỡ thùng xốp',
    instructionViHanoi: 'Hộp xốp dính dầu mỡ, thức ăn bẩn không đủ điều kiện tái chế. Bỏ vào nhóm chất thải rắn sinh hoạt khác để đốt phát điện.',
    instructionViHcmc: 'Hộp xốp đựng thức ăn dính dầu mỡ thuộc nhóm rác sinh hoạt còn lại. (Nếu là thùng xốp sạch giữ nguyên vẹn có thể tái sử dụng hoặc gửi cơ sở phế liệu).',
  },
  {
    id: 'single-use-plastic-bag',
    stream: 'other',
    nameEn: 'Single-use plastic carrier bag',
    nameVi: 'Túi ni lông dùng một lần dính bẩn',
    chipEn: 'Single-use plastic bag',
    chipVi: 'Túi ni lông dùng 1 lần',
    queryEn: 'a thin single-use plastic carrier shopping bag',
    queryVi: 'túi ni lông mỏng đi chợ dính bẩn',
    instructionViHanoi: 'Túi ni lông mỏng đi chợ dính bẩn làm kẹt máy phân loại rác tái chế. Bỏ vào nhóm chất thải rắn sinh hoạt khác để xử lý thiêu đốt.',
    instructionViHcmc: 'Túi ni lông mỏng dùng một lần dính tạp chất hữu cơ bỏ vào thùng rác còn lại. Chỉ có màng bọc nilon sạch, khô mới được đưa vào nhóm tái chế.',
  },
  {
    id: 'worn-out-footwear',
    stream: 'other',
    nameEn: 'Old worn-out shoes and footwear',
    nameVi: 'Giày dép cũ rách hỏng',
    chipEn: 'Worn-out footwear',
    chipVi: 'Giày dép rách hỏng',
    queryEn: 'torn broken unwearable shoes and sandals',
    queryVi: 'giày thể thao rách dép xốp đứt quai',
    instructionViHanoi: 'Giày dép rách nát kết hợp keo dán, cao su tổng hợp và vải không tái chế được. Bỏ vào nhóm chất thải rắn sinh hoạt khác.',
    instructionViHcmc: 'Giày dép cũ hỏng không còn giá trị sử dụng thuộc nhóm rác sinh hoạt còn lại để thu gom đốt hoặc chôn lấp hợp vệ sinh.',
  },
  {
    id: 'used-medical-mask',
    stream: 'other',
    nameEn: 'Used disposable medical mask',
    nameVi: 'Khẩu trang y tế dùng một lần',
    chipEn: 'Disposable medical mask',
    chipVi: 'Khẩu trang y tế dùng 1 lần',
    queryEn: 'a used disposable 3-ply surgical medical mask',
    queryVi: 'khẩu trang y tế dùng 1 lần vứt bỏ',
    instructionViHanoi: 'Cắt quai đeo để tránh vướng mắc động vật, gấp gọn và cho vào túi rác sinh hoạt khác buộc kín trước khi chuyển giao.',
    instructionViHcmc: 'Cắt dây thun quai đeo, cuộn mặt ngoài vào trong và bỏ vào túi rác sinh hoạt còn lại buộc kín miệng túi.',
  },
  {
    id: 'incense-joss-paper-ash',
    stream: 'other',
    nameEn: 'Incense ash and joss paper ash',
    nameVi: 'Tàn nhang, tro vàng mã đã nguội',
    chipEn: 'Incense / joss ash',
    chipVi: 'Tàn nhang, tro vàng mã',
    queryEn: 'cold fully extinguished incense sticks and joss paper ash',
    queryVi: 'tàn nhang thắp hương tro đốt vàng mã',
    instructionViHanoi: 'Bắt buộc để tro nguội hoàn toàn 100% để chống nguy cơ hỏa hoạn xe rác và bãi rác. Buộc kín trong túi và bỏ vào nhóm chất thải rắn sinh hoạt khác.',
    instructionViHcmc: 'Đảm bảo tro vàng mã đã tắt ngấu hoàn toàn, đóng gói kỹ vào túi kín tránh bụi bay và bỏ vào thùng rác sinh hoạt còn lại.',
  },
  {
    id: 'used-cooking-oil',
    stream: 'other',
    nameEn: 'Used cooking oil',
    nameVi: 'Dầu ăn đã qua sử dụng',
    chipEn: 'Used cooking oil',
    chipVi: 'Dầu ăn đã qua sử dụng',
    queryEn: 'used cooking oil or frying grease from kitchen',
    queryVi: 'dầu ăn chiên rán thừa đổ ra',
    instructionViHanoi: 'Không đổ trực tiếp xuống bồn rửa gây tắc cống do đông dầu mỡ. Lọc bã, đổ vào chai nhựa đóng chặt nắp rồi giao cho cơ sở thu gom dầu thải làm nhiên liệu sinh học hoặc bỏ vào rác còn lại.',
    instructionViHcmc: 'Nghiêm cấm đổ dầu ăn vào hệ thống thoát nước sinh hoạt. Rót vào chai nhựa đậy nắp kín giao các đơn vị thu mua dầu ăn thải tái chế biodiesel hoặc bỏ vào rác còn lại.',
  },
];

const TRANSLATIONS = {
  vi: {
    pageTitle: 'WhatBin — Check where it goes',
    mastheadNote: 'Việt Nam · Cẩm nang phân loại rác tại nguồn',
    introEyebrow: 'Phân loại rác tại nguồn',
    introTitle: 'Bỏ vào thùng nào?',
    introCopy: 'Tra cứu quy định phân loại rác theo từng đô thị và đối chiếu trực tiếp với căn cứ pháp lý chính thức.',
    step1Number: '01',
    step1Title: 'Chụp ảnh hoặc mô tả đồ cần bỏ',
    step1Copy: 'Chọn thành phố, sau đó chụp ảnh, tải ảnh hoặc nhập mô tả vật dụng.',
    cityLabel: 'Thành phố của bạn',
    cityHanoi: 'Hà Nội',
    cityHcmc: 'TP. Hồ Chí Minh',
    itemLabel: 'Vật dụng bạn muốn bỏ là gì?',
    itemPlaceholder: 'Mô tả vật dụng hoặc tình trạng (ví dụ: chai nhựa rỗng, bóng đèn huỳnh quang, đệm mút cũ...)',
    streamCatalogLabel: 'Danh mục 5 nhóm rác & tra cứu nhanh',
    streamRecyclable: 'Tái chế',
    streamFood: 'Thực phẩm',
    streamHazardous: 'Nguy hại',
    streamBulky: 'Cồng kềnh',
    streamOther: 'Rác khác',
    photoLabel: 'Chụp ảnh hoặc chọn ảnh',
    photoOptional: '(không bắt buộc)',
    photoPickerTitle: 'Hình ảnh vật dụng',
    photoPickerCopy: 'Chụp ảnh trực tiếp hoặc chọn ảnh/ảnh chụp màn hình từ thư viện.',
    takePhoto: 'Chụp ảnh',
    choosePhoto: 'Tải ảnh lên',
    photoReady: 'Ảnh đã sẵn sàng',
    removePhoto: 'Gỡ ảnh',
    photoHint: 'Có thể chọn ảnh chụp màn hình từ thư viện. Ảnh chỉ được gửi đi khi bạn bấm nhận diện.',
    privacyNote: 'Mô tả và hình ảnh chỉ được gửi đến mô hình AI khi bạn nhấn nhận diện để xác định nhóm rác. WhatBin không lưu trữ hình ảnh hay dữ liệu cá nhân của bạn.',
    recognizeBtn: 'Nhận diện & Tra cứu',
    identifying: 'Đang nhận diện vật dụng…',
    manualHeading: 'Chọn từ danh mục chuẩn',
    manualIntro: 'Chọn vật dụng gần đúng nhất. Bước tiếp theo kiểm tra quy định ban hành tại thành phố của bạn; nếu chưa có quy định, WhatBin sẽ không tự suy đoán.',
    manualSelectLabel: 'Vật dụng danh mục',
    manualSelectPlaceholder: 'Chọn một vật dụng chuẩn',
    manualUseBtn: 'Sử dụng mục này',
    step2Number: '02',
    step2Title: 'Xác nhận vật dụng',
    step2Intro: 'Kiểm tra kết quả nhận diện trước khi tra cứu hướng dẫn phân loại.',
    confirmBtn: 'Xác nhận & Xem hướng dẫn',
    correctBtn: 'Chưa đúng — sửa lại mô tả',
    step3Number: '03',
    step3Title: 'Kết quả phân loại',
    statusMatched: 'QUY ĐỊNH CHÍNH THỨC',
    statusUnknown: 'CHƯA CÓ QUY ĐỊNH',
    statusConflict: 'CÓ Ý KIẾN TRÁI CHIỀU',
    statusUnavailable: 'CHƯA KHẢ DỤNG',
    effectiveFrom: 'Hiệu lực từ',
    effectiveUntil: 'Hiệu lực đến',
    resolvedForDate: 'Áp dụng theo ngày',
    notProvided: 'Không quy định thời hạn',
    officialSources: 'Căn cứ pháp lý',
    noSources: 'Không có tài liệu nguồn trích dẫn.',
    openSource: 'Xem toàn văn văn bản gốc',
    supportingPassages: 'Trích dẫn nguyên văn văn bản quy phạm pháp luật',
    compareCitiesBtn: 'So sánh Hà Nội & TP. Hồ Chí Minh',
    comparingCities: 'Đang kiểm tra quy định của cả Hà Nội và TP. Hồ Chí Minh…',
    comparisonComplete: 'Hoàn tất so sánh quy định giữa 2 thành phố.',
    comparisonFailed: 'Hoàn tất so sánh. Một số kết quả chưa thể tải.',
    explainerHeading: 'Hỏi thêm về kết quả này',
    explainerCopy: 'Đặt câu hỏi để làm rõ hướng dẫn phân loại. Kết quả và căn cứ pháp lý hiển thị ở trên luôn là căn cứ chính thức.',
    explainerQuestionLabel: 'Đặt câu hỏi về cách phân loại vật dụng này',
    explainerSubmit: 'Gửi câu hỏi',
    explainerLoading: 'Đang đối chiếu cơ sở dữ liệu pháp lý…',
    footerText: 'Luôn đối chiếu văn bản quy phạm pháp luật được liên kết để cập nhật hướng dẫn mới nhất.',
  },
  en: {
    pageTitle: 'WhatBin — Check where it goes',
    mastheadNote: 'Vietnam · local sorting guide',
    introEyebrow: 'A clearer next step for your waste',
    introTitle: 'Where does it go?',
    introCopy: 'Check for a reviewed rule in your city, then verify any guidance against its linked official source.',
    step1Number: '01',
    step1Title: 'Describe your item',
    step1Copy: 'Choose a city, then add a photo, a description, or both.',
    cityLabel: 'Your city',
    cityHanoi: 'Hanoi',
    cityHcmc: 'Ho Chi Minh City',
    itemLabel: 'What is the item?',
    itemPlaceholder: 'Describe the item and its condition',
    streamCatalogLabel: 'Browse 5 waste streams & quick-tap catalog items',
    streamRecyclable: 'Recyclables',
    streamFood: 'Food waste',
    streamHazardous: 'Hazardous',
    streamBulky: 'Bulky',
    streamOther: 'Other waste',
    photoLabel: 'Add a photo',
    photoOptional: '(optional)',
    photoPickerTitle: 'Show us the item',
    photoPickerCopy: 'Take a new photo or choose a saved photo or screenshot.',
    takePhoto: 'Take a photo',
    choosePhoto: 'Choose photo',
    photoReady: 'Photo ready',
    removePhoto: 'Remove',
    photoHint: 'Choose a screenshot from your photo library, too. Your image is only sent when you identify the item.',
    privacyNote: 'Your description and any photo are sent to Gemini or OpenRouter, depending on server configuration, only when you identify the item. WhatBin does not store them.',
    recognizeBtn: 'Identify item',
    identifying: 'Identifying your item…',
    manualHeading: 'Choose a catalog item',
    manualIntro: 'Choose only a close match. The next step checks for a reviewed rule in your city; if none exists, WhatBin will not provide a disposal route.',
    manualSelectLabel: 'Catalog item',
    manualSelectPlaceholder: 'Choose a catalog item',
    manualUseBtn: 'Use this item',
    step2Number: '02',
    step2Title: 'Confirm the item',
    step2Intro: 'Check this identification before looking up city guidance.',
    confirmBtn: 'Yes, look this up',
    correctBtn: 'Not quite — edit description',
    step3Number: '03',
    step3Title: 'City guidance',
    statusMatched: 'MATCHED',
    statusUnknown: 'UNKNOWN',
    statusConflict: 'CONFLICT',
    statusUnavailable: 'UNAVAILABLE',
    effectiveFrom: 'Effective from',
    effectiveUntil: 'Effective until',
    resolvedForDate: 'Resolved for local date',
    notProvided: 'Not provided',
    officialSources: 'Official sources',
    noSources: 'No source references were provided.',
    openSource: 'Open cited source',
    supportingPassages: 'Supporting passages (original Vietnamese)',
    compareCitiesBtn: 'Compare both cities',
    comparingCities: 'Checking guidance for Hanoi and Ho Chi Minh City…',
    comparisonComplete: 'Comparison complete.',
    comparisonFailed: 'Comparison complete. Guidance could not be loaded for one or more cities.',
    explainerHeading: 'Ask about this result',
    explainerCopy: 'Get an explanation of this result. WhatBin’s displayed status and any instruction stay authoritative.',
    explainerQuestionLabel: 'Ask a question about this item',
    explainerSubmit: 'Ask WhatBin',
    explainerLoading: 'Checking the published sources…',
    footerText: 'Check the linked source for the latest official guidance.',
  },
};

const CATEGORY_LOCALIZATIONS = {
  'Reusable and recyclable solid waste': {
    vi: 'Chất thải có khả năng tái sử dụng, tái chế',
    en: 'Reusable and recyclable solid waste',
  },
  'Food waste': {
    vi: 'Chất thải thực phẩm',
    en: 'Food waste',
  },
  'Household hazardous waste': {
    vi: 'Chất thải nguy hại hộ gia đình',
    en: 'Household hazardous waste',
  },
  'Bulky waste': {
    vi: 'Chất thải cồng kềnh',
    en: 'Bulky waste',
  },
  'Other domestic solid waste': {
    vi: 'Chất thải rắn sinh hoạt khác',
    en: 'Other domestic solid waste',
  },
};

// DOM References
const form = document.querySelector('#recognize-form');
const citySelect = document.querySelector('#jurisdiction');
const descriptionInput = document.querySelector('#description');
const imageInput = document.querySelector('#image');
const cameraInput = document.querySelector('#camera-image');
const takePhotoButton = document.querySelector('#take-photo-button');
const choosePhotoButton = document.querySelector('#choose-photo-button');
const imagePreview = document.querySelector('#image-preview');
const imagePreviewImage = document.querySelector('#image-preview-image');
const imagePreviewName = document.querySelector('#image-preview-name');
const removeImageButton = document.querySelector('#remove-image-button');
const recognitionFeedback = document.querySelector('#recognition-feedback');
const candidatePanel = document.querySelector('#candidate-panel');
const candidateName = document.querySelector('#candidate-name');
const confirmButton = document.querySelector('#confirm-button');
const correctButton = document.querySelector('#correct-button');
const resultPanel = document.querySelector('#result-panel');
const resultStatus = document.querySelector('#result-status');
const resultContent = document.querySelector('#result-content');
const compareCitiesButton = document.querySelector('#compare-cities-button');
const comparisonFeedback = document.querySelector('#comparison-feedback');
const comparisonPanel = document.querySelector('#comparison-panel');
const recognizeButton = document.querySelector('#recognize-button');
const manualPanel = document.querySelector('#manual-panel');
const manualItemSelect = document.querySelector('#manual-item');
const manualChooseButton = document.querySelector('#manual-choose-button');
const streamTabsContainer = document.querySelector('.stream-tabs');
const streamChipsContainer = document.querySelector('#stream-chips');
const langButtons = document.querySelectorAll('.lang-btn');

// App State
let currentLang = 'vi';
try {
  const saved = localStorage.getItem('whatbin_lang');
  if (saved === 'en' || saved === 'vi') currentLang = saved;
} catch {}

let activeStream = 'recyclables';
let candidate = null;
let currentResolvedData = null;
let requestVersion = 0;
let explanationHistory = [];
let manualItems = [];
let explanationVersion = 0;
let comparisonVersion = 0;
let imagePreviewUrl = null;
let selectedImage = null;

// Helpers
function t(key) {
  return TRANSLATIONS[currentLang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
}

function cityName(city) {
  if (currentLang === 'vi') {
    return city === 'hanoi' ? 'Hà Nội' : 'TP. Hồ Chí Minh';
  }
  return city === 'hanoi' ? 'Hanoi' : 'Ho Chi Minh City';
}

function findCatalogItem(id) {
  return CANONICAL_CATALOG.find((item) => item.id === id);
}

function itemDisplayName(canonicalItemId, fallbackName) {
  const item = findCatalogItem(canonicalItemId);
  if (!item) return fallbackName || canonicalItemId;
  if (currentLang === 'vi') {
    return `${item.nameVi} (${item.nameEn})`;
  }
  return item.nameEn;
}

function setLanguage(lang) {
  if (lang !== 'vi' && lang !== 'en') return;
  currentLang = lang;
  try {
    localStorage.setItem('whatbin_lang', lang);
  } catch {}

  document.documentElement.lang = lang;
  for (const btn of langButtons) {
    const isActive = btn.dataset.lang === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-checked', String(isActive));
  }

  // Update i18n static text
  for (const el of document.querySelectorAll('[data-i18n]')) {
    const key = el.dataset.i18n;
    if (key && TRANSLATIONS[lang]?.[key]) {
      el.textContent = TRANSLATIONS[lang][key];
    }
  }

  // Update placeholders
  for (const el of document.querySelectorAll('[data-i18n-placeholder]')) {
    const key = el.dataset.i18nPlaceholder;
    if (key && TRANSLATIONS[lang]?.[key]) {
      el.placeholder = TRANSLATIONS[lang][key];
    }
  }

  // Update stream chips
  renderStreamChips(activeStream);

  // Update candidate display if open
  if (candidate) {
    candidateName.textContent = itemDisplayName(candidate.canonicalItemId, candidate.itemName);
  }

  // Update manual select options if populated
  if (manualItems.length) {
    const currentVal = manualItemSelect.value;
    manualItemSelect.replaceChildren();
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = t('manualSelectPlaceholder');
    manualItemSelect.append(placeholder);
    for (const item of manualItems) {
      const option = document.createElement('option');
      option.value = item.canonicalItemId;
      option.textContent = itemDisplayName(item.canonicalItemId, item.itemName);
      manualItemSelect.append(option);
    }
    manualItemSelect.value = currentVal;
  }

  // Update result panel if showing
  if (!resultPanel.hidden && currentResolvedData && candidate) {
    renderResolution(currentResolvedData, citySelect.value, candidate.canonicalItemId);
  }
}

// Stream Tabs & Catalog Chips
function renderStreamChips(stream) {
  streamChipsContainer.replaceChildren();
  const items = CANONICAL_CATALOG.filter((item) => item.stream === stream);

  for (const item of items) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'example-chip';
    button.dataset.itemId = item.id;
    button.textContent = currentLang === 'vi' ? item.chipVi : item.chipEn;
    button.setAttribute('aria-controls', 'description');

    button.addEventListener('click', () => {
      requestVersion++;
      clearResults();
      recognizeButton.disabled = false;
      confirmButton.disabled = false;
      correctButton.disabled = false;

      // Populate input with descriptive phrase
      const query = currentLang === 'vi' ? item.queryVi : item.queryEn;
      descriptionInput.value = query;

      // Immediately set canonical candidate for instant lookup
      setCandidate({
        canonicalItemId: item.id,
        itemName: item.nameEn,
      });

      // Show friendly feedback directing user to confirm
      showFeedback(
        currentLang === 'vi'
          ? `Đã chọn: ${item.nameVi}. Nhấn "Xác nhận & Xem hướng dẫn" để kiểm tra quy định tại ${cityName(citySelect.value)}.`
          : `Selected: ${item.nameEn}. Click "Yes, look this up" to check rules for ${cityName(citySelect.value)}.`
      );
    });

    streamChipsContainer.append(button);
  }
}

function setupStreamTabs() {
  const tabs = document.querySelectorAll('.stream-tab');
  for (const tab of tabs) {
    tab.addEventListener('click', () => {
      for (const t of tabs) {
        const isCurrent = t === tab;
        t.classList.toggle('active', isCurrent);
        t.setAttribute('aria-selected', String(isCurrent));
      }
      activeStream = tab.dataset.stream;
      renderStreamChips(activeStream);
    });
  }
}

function clearResults() {
  candidate = null;
  currentResolvedData = null;
  comparisonVersion++;
  candidatePanel.hidden = true;
  manualPanel.hidden = true;
  manualItemSelect.replaceChildren();
  resultPanel.hidden = true;
  resultStatus.textContent = '';
  resultContent.replaceChildren();
  compareCitiesButton.hidden = true;
  compareCitiesButton.disabled = false;
  comparisonFeedback.hidden = true;
  comparisonFeedback.textContent = '';
  comparisonPanel.hidden = true;
  comparisonPanel.replaceChildren();
  candidateName.textContent = '';
  recognitionFeedback.textContent = '';
  recognitionFeedback.hidden = true;
  explanationHistory = [];
  explanationVersion++;
}

function showFeedback(message, isError = false) {
  recognitionFeedback.textContent = message;
  recognitionFeedback.classList.toggle('feedback-error', isError);
  recognitionFeedback.hidden = false;
}

async function offerManualSelection(message, version) {
  showFeedback(
    currentLang === 'vi'
      ? `${message} Đang tải danh mục vật dụng…`
      : `${message} Loading the item catalog…`,
    true
  );
  manualPanel.hidden = true;
  manualChooseButton.disabled = true;
  manualItemSelect.disabled = true;
  manualItemSelect.replaceChildren();
  try {
    const response = await fetch('/api/items');
    const data = await response.json();
    if (!response.ok || !Array.isArray(data?.items) || !data.items.length) throw new Error();
    manualItems = data.items;
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = t('manualSelectPlaceholder');
    manualItemSelect.append(placeholder);
    for (const item of manualItems) {
      if (typeof item?.canonicalItemId !== 'string' || typeof item?.itemName !== 'string') throw new Error();
      const option = document.createElement('option');
      option.value = item.canonicalItemId;
      option.textContent = itemDisplayName(item.canonicalItemId, item.itemName);
      manualItemSelect.append(option);
    }
    if (version !== requestVersion) return;
    manualPanel.hidden = false;
    manualItemSelect.disabled = false;
    manualChooseButton.disabled = false;
    showFeedback(message, true);
    manualItemSelect.focus();
  } catch {
    if (version === requestVersion) {
      manualPanel.hidden = true;
      showFeedback(
        currentLang === 'vi'
          ? `${message} Không thể tải danh mục vật dụng. Vui lòng thử lại.`
          : `${message} The item catalog could not be loaded. Please try again.`,
        true
      );
    }
  }
}

function setCandidate(item) {
  candidate = { canonicalItemId: item.canonicalItemId, itemName: item.itemName };
  manualPanel.hidden = true;
  candidateName.textContent = itemDisplayName(candidate.canonicalItemId, candidate.itemName);
  candidatePanel.hidden = false;
  confirmButton.focus();
}

async function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const result = String(reader.result || '');
      const comma = result.indexOf(',');
      if (comma < 0) {
        reject(new Error(
          currentLang === 'vi'
            ? 'Không thể đọc ảnh. Vui lòng chọn lại ảnh hoặc nhập mô tả bằng chữ.'
            : 'Could not read that photo. Choose it again or continue with a description.'
        ));
      } else {
        resolve({ mimeType: file.type, base64: result.slice(comma + 1) });
      }
    }, { once: true });
    reader.addEventListener('error', () => {
      reject(new Error(
        currentLang === 'vi'
          ? 'Không thể đọc ảnh. Vui lòng chọn lại ảnh hoặc nhập mô tả bằng chữ.'
          : 'Could not read that photo. Choose it again or continue with a description.'
      ));
    }, { once: true });
    reader.readAsDataURL(file);
  });
}

function clearImagePreview() {
  if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
  imagePreviewUrl = null;
  imagePreviewImage.removeAttribute('src');
  imagePreviewImage.alt = '';
  imagePreviewName.textContent = '';
  imagePreview.hidden = true;
}

function showImagePreview(file) {
  clearImagePreview();
  selectedImage = file;
  imagePreviewUrl = URL.createObjectURL(file);
  imagePreviewImage.src = imagePreviewUrl;
  imagePreviewImage.alt = `Selected photo: ${file.name}`;
  imagePreviewName.textContent = file.name;
  imagePreview.hidden = false;
}

for (const input of [imageInput, cameraInput]) {
  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (file) showImagePreview(file);
  });
}

takePhotoButton.addEventListener('click', () => cameraInput.click());
choosePhotoButton.addEventListener('click', () => imageInput.click());

removeImageButton.addEventListener('click', () => {
  imageInput.value = '';
  cameraInput.value = '';
  selectedImage = null;
  clearImagePreview();
  choosePhotoButton.focus();
});

async function postJson(path, body) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(
      currentLang === 'vi'
        ? 'Dịch vụ trả về phản hồi không hợp lệ. Vui lòng thử lại.'
        : 'The service returned an unreadable response. Please try again.'
    );
  }
  if (!response.ok) {
    throw new Error(
      typeof data?.error === 'string'
        ? data.error
        : typeof data?.message === 'string'
          ? data.message
          : (currentLang === 'vi'
              ? 'Yêu cầu không thể hoàn tất. Vui lòng thử lại.'
              : 'The request could not be completed. Please try again.')
    );
  }
  return data;
}

async function postTextStream(path, body, onText) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    let data;
    try { data = await response.json(); } catch {}
    throw new Error(
      typeof data?.error === 'string'
        ? data.error
        : (currentLang === 'vi'
            ? 'Yêu cầu không thể hoàn tất. Vui lòng thử lại.'
            : 'The request could not be completed. Please try again.')
    );
  }
  if (!response.body) {
    throw new Error(
      currentLang === 'vi'
        ? 'Máy chủ không hỗ trợ luồng dữ liệu phản hồi.'
        : 'The service did not provide a response stream.'
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
      onText(text);
    }
    text += decoder.decode();
    if (text) onText(text);
  } finally {
    reader.releaseLock();
  }
  return text;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const description = descriptionInput.value.trim();
  const file = selectedImage;
  if (!description && !file) {
    showFeedback(
      currentLang === 'vi'
        ? 'Hãy nhập mô tả, chụp ảnh hoặc chọn ảnh để nhận diện vật dụng.'
        : 'Add a description, take a photo, or choose an image to identify the item.',
      true
    );
    descriptionInput.focus();
    return;
  }

  const version = ++requestVersion;
  clearResults();
  recognizeButton.disabled = true;
  showFeedback(t('identifying'));
  try {
    const payload = {};
    if (description) payload.description = description;
    if (file) payload.image = await readImage(file);
    if (version !== requestVersion) return;
    const data = await postJson('/api/recognize', payload);
    if (version !== requestVersion) return;
    const proposed = data?.candidate;
    if (!proposed || typeof proposed.canonicalItemId !== 'string' || !proposed.canonicalItemId.trim() || typeof proposed.itemName !== 'string' || !proposed.itemName.trim()) {
      await offerManualSelection(
        typeof data?.message === 'string' && data.message
          ? `${data.message} ${currentLang === 'vi' ? 'Hoặc chọn từ danh mục chuẩn:' : 'Or choose a catalog item:'}`
          : (currentLang === 'vi'
              ? 'Chưa nhận diện được độ chắc chắn cao. Vui lòng chọn từ danh mục chuẩn:'
              : 'I could not confidently identify that item. Choose a catalog item instead:'),
        version
      );
      return;
    }
    setCandidate(proposed);
    recognitionFeedback.hidden = true;
  } catch (error) {
    if (version === requestVersion) {
      await offerManualSelection(
        `${error instanceof Error ? error.message : (currentLang === 'vi' ? 'Nhận diện thất bại.' : 'Recognition failed.')} ${currentLang === 'vi' ? 'Chọn từ danh mục chuẩn:' : 'Choose a catalog item instead:'}`,
        version
      );
    }
  } finally {
    if (version === requestVersion) recognizeButton.disabled = false;
  }
});

manualChooseButton.addEventListener('click', () => {
  const selected = manualItems.find((item) => item.canonicalItemId === manualItemSelect.value);
  if (!selected) {
    showFeedback(
      currentLang === 'vi'
        ? 'Hãy chọn một vật dụng từ danh mục chuẩn.'
        : 'Choose an item from the catalog.',
      true
    );
    manualItemSelect.focus();
    return;
  }
  setCandidate(selected);
});

citySelect.addEventListener('change', () => {
  requestVersion++;
  comparisonVersion++;
  explanationVersion++;
  explanationHistory = [];
  recognizeButton.disabled = false;
  confirmButton.disabled = false;
  correctButton.disabled = false;
  resultPanel.hidden = true;
  resultStatus.textContent = '';
  resultContent.replaceChildren();
  compareCitiesButton.hidden = true;
  compareCitiesButton.disabled = false;
  comparisonFeedback.hidden = true;
  comparisonFeedback.textContent = '';
  comparisonPanel.hidden = true;
  comparisonPanel.replaceChildren();
  recognitionFeedback.textContent = '';
  recognitionFeedback.hidden = true;
  if (candidate) {
    candidatePanel.hidden = false;
    showFeedback(
      currentLang === 'vi'
        ? `Xác nhận vật dụng để xem quy định của ${cityName(citySelect.value)}.`
        : `Confirm the identified item to get guidance for ${cityName(citySelect.value)}.`
    );
  } else if (manualPanel.hidden) {
    candidatePanel.hidden = true;
    candidateName.textContent = '';
    manualItemSelect.replaceChildren();
  } else {
    candidatePanel.hidden = true;
  }
});

correctButton.addEventListener('click', () => {
  requestVersion++;
  clearResults();
  descriptionInput.focus();
});

function addText(parent, tag, text, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.textContent = text;
  parent.append(node);
  return node;
}

function appendMarkdownInline(parent, text) {
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let position = 0;
  for (const match of text.matchAll(pattern)) {
    parent.append(document.createTextNode(text.slice(position, match.index)));
    const strong = match[0].startsWith('**');
    const node = document.createElement(strong ? 'strong' : 'em');
    node.textContent = match[0].slice(strong ? 2 : 1, strong ? -2 : -1);
    parent.append(node);
    position = match.index + match[0].length;
  }
  parent.append(document.createTextNode(text.slice(position)));
}

function renderMarkdown(container, markdown) {
  container.replaceChildren();
  let paragraph = [];
  let list = null;
  const flushParagraph = () => {
    if (!paragraph.length) return;
    const node = document.createElement('p');
    appendMarkdownInline(node, paragraph.join(' '));
    container.append(node);
    paragraph = [];
  };

  for (const line of markdown.split(/\r?\n/)) {
    if (!line.trim()) {
      flushParagraph();
      list = null;
      continue;
    }
    const heading = line.match(/^\s{0,3}#{1,6}\s+(.+)$/);
    if (heading) {
      flushParagraph();
      list = null;
      const node = document.createElement('h4');
      appendMarkdownInline(node, heading[1]);
      container.append(node);
      continue;
    }
    const item = line.match(/^\s{0,3}(?:(\d+)[.)]\s+|[-*+]\s+)(.+)$/);
    if (item) {
      flushParagraph();
      const tag = item[1] ? 'ol' : 'ul';
      if (!list || list.tagName.toLowerCase() !== tag) {
        list = document.createElement(tag);
        if (item[1]) list.start = Number(item[1]);
        container.append(list);
      }
      const node = document.createElement('li');
      appendMarkdownInline(node, item[2]);
      list.append(node);
      continue;
    }
    list = null;
    paragraph.push(line.trim());
  }
  flushParagraph();
}

function safeUrl(value) {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value, window.location.href);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
  } catch {
    return null;
  }
}

function renderSources(references, contentNode = resultContent) {
  const section = document.createElement('section');
  section.className = 'result-section';
  addText(section, 'h3', t('officialSources'));
  if (!Array.isArray(references) || references.length === 0) {
    addText(section, 'p', t('noSources'), 'muted-copy');
    contentNode.append(section);
    return;
  }
  const list = document.createElement('ul');
  list.className = 'source-list';
  for (const reference of references) {
    const item = document.createElement('li');
    if (typeof reference === 'string') {
      const url = safeUrl(reference);
      if (url) {
        const link = addText(item, 'a', reference);
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      } else addText(item, 'span', reference);
    } else if (reference && typeof reference === 'object') {
      const label = [reference.title, reference.citation, reference.label].find(
        (value) => typeof value === 'string' && value.trim()
      );
      const href = safeUrl(reference.url || reference.href);
      if (href) {
        const link = addText(item, 'a', label || href);
        link.href = href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        if (typeof reference.citation === 'string' && label !== reference.citation) {
          addText(item, 'span', ' — ' + reference.citation);
        }
      } else if (label) addText(item, 'span', label);
      else addText(item, 'span', t('officialSources'));
    } else continue;
    list.append(item);
  }
  if (list.childElementCount) section.append(list);
  else addText(section, 'p', t('noSources'), 'muted-copy');
  contentNode.append(section);
}

function renderResolution(
  data,
  city,
  canonicalItemId,
  {
    panel = resultPanel,
    statusNode = resultStatus,
    contentNode = resultContent,
    includeExplainer = true,
    includeCity = true,
  } = {}
) {
  currentResolvedData = data;
  const status = typeof data?.status === 'string' ? data.status : '';
  panel.hidden = false;

  let statusLabel = status || 'UNAVAILABLE';
  let statusClass = 'status-unavailable';
  if (status === 'MATCHED') {
    statusClass = 'status-matched';
    statusLabel = t('statusMatched');
  } else if (status === 'UNKNOWN') {
    statusClass = 'status-unknown';
    statusLabel = t('statusUnknown');
  } else if (status === 'CONFLICT') {
    statusClass = 'status-conflict';
    statusLabel = t('statusConflict');
  } else {
    statusLabel = t('statusUnavailable');
  }

  statusNode.textContent = statusLabel;
  statusNode.className = `status-pill ${statusClass}`;
  contentNode.replaceChildren();

  if (includeCity) addText(contentNode, 'p', cityName(city), 'result-city');

  if (status !== 'MATCHED') {
    if (status === 'UNKNOWN') {
      const date = typeof data.asOf === 'string' ? data.asOf : 'the current local date';
      addText(
        contentNode,
        'p',
        currentLang === 'vi'
          ? `WhatBin chưa ghi nhận quy định chính thức cho vật dụng này tại ${cityName(city)} tính đến ngày ${date}. Điều này không đồng nghĩa là không có hướng dẫn thu gom của địa phương.`
          : `WhatBin has no reviewed rule for this item in ${cityName(city)} as of ${date}. This does not establish that no legal route exists.`,
        'result-message'
      );
      if (includeExplainer) renderExplainer(city, canonicalItemId);
    } else if (status === 'CONFLICT') {
      addText(
        contentNode,
        'p',
        typeof data.message === 'string' && data.message
          ? data.message
          : (currentLang === 'vi'
              ? 'Tài liệu công bố có sự không thống nhất giữa các văn bản quy định; không có hướng dẫn phân loại duy nhất.'
              : 'Published records conflict for this item and city; no disposal action is provided.'),
        'result-message'
      );
      if (Array.isArray(data.conflicts) && data.conflicts.length) {
        const section = document.createElement('section');
        section.className = 'result-section conflict-evidence';
        addText(section, 'h3', currentLang === 'vi' ? 'Các văn bản không thống nhất' : 'Conflicting records');
        for (const conflict of data.conflicts) {
          if (!conflict || typeof conflict !== 'object') continue;
          const entry = document.createElement('div');
          entry.className = 'conflict-entry';
          if (typeof conflict.summary === 'string' && conflict.summary) addText(entry, 'p', conflict.summary);
          const from = conflict.effectiveFrom ?? conflict.validFrom;
          const until = conflict.effectiveUntil ?? conflict.validUntil;
          if ((typeof from === 'string' && from) || (typeof until === 'string' && until)) {
            const dates = document.createElement('p');
            dates.className = 'muted-copy';
            if (typeof from === 'string' && from) addText(dates, 'span', `${t('effectiveFrom')} ${from} `);
            if (typeof until === 'string' && until) addText(dates, 'span', `${t('effectiveUntil')} ${until}`);
            entry.append(dates);
          }
          if (Array.isArray(conflict.claims)) {
            for (const claim of conflict.claims) {
              if (!claim || typeof claim !== 'object') continue;
              const claimEntry = document.createElement('div');
              claimEntry.className = 'conflict-claim';
              if (typeof claim.sourceTitle === 'string' && claim.sourceTitle) addText(claimEntry, 'h4', claim.sourceTitle);
              if (typeof claim.sourceVersion === 'string' && claim.sourceVersion) addText(claimEntry, 'p', claim.sourceVersion, 'muted-copy');
              if (typeof claim.citation === 'string' && claim.citation) addText(claimEntry, 'p', claim.citation);
              if (typeof claim.claim === 'string' && claim.claim) addText(claimEntry, 'blockquote', claim.claim);
              const href = safeUrl(claim.sourceUrl);
              if (href) {
                const link = addText(claimEntry, 'a', t('openSource'));
                link.href = href;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
              }
              entry.append(claimEntry);
            }
          }
          section.append(entry);
        }
        if (section.childElementCount > 1) contentNode.append(section);
      }
      if (includeExplainer) renderExplainer(city, canonicalItemId);
    } else {
      addText(
        contentNode,
        'p',
        currentLang === 'vi'
          ? 'Hệ thống chưa tìm thấy hướng dẫn phù hợp. Vui lòng thử lại sau.'
          : 'The service did not return a usable matched result. Please try again later.',
        'result-message'
      );
    }
    if ((status === 'UNKNOWN' || status === 'CONFLICT') && typeof data.asOf === 'string') {
      addText(contentNode, 'p', `${t('resolvedForDate')}: ${data.asOf}`, 'muted-copy');
    }
    return;
  }

  // MATCHED Status Rendering
  const catalogItem = findCatalogItem(canonicalItemId);
  const localizedItemName = itemDisplayName(canonicalItemId, data.itemName);
  addText(contentNode, 'p', localizedItemName, 'result-item-name');

  // Category
  const cat = data.category;
  const localizedCat =
    currentLang === 'vi'
      ? CATEGORY_LOCALIZATIONS[cat]?.vi || cat
      : CATEGORY_LOCALIZATIONS[cat]?.en || cat;
  if (localizedCat) addText(contentNode, 'p', localizedCat, 'result-category');

  // Instruction
  const instructionBlock = document.createElement('div');
  instructionBlock.className = 'instruction';
  if (currentLang === 'vi') {
    const viText = city === 'hanoi' ? catalogItem?.instructionViHanoi : catalogItem?.instructionViHcmc;
    if (viText) {
      addText(instructionBlock, 'p', viText);
      if (typeof data.instruction === 'string' && data.instruction) {
        addText(instructionBlock, 'p', `(${data.instruction})`, 'muted-copy');
      }
    } else if (typeof data.instruction === 'string' && data.instruction) {
      addText(instructionBlock, 'p', data.instruction);
    }
  } else if (typeof data.instruction === 'string' && data.instruction) {
    addText(instructionBlock, 'p', data.instruction);
  }
  contentNode.append(instructionBlock);

  // Effective Dates
  const from = data.effectiveFrom ?? data.validFrom;
  const until = data.effectiveUntil ?? data.validUntil;
  const dates = document.createElement('dl');
  dates.className = 'effective-dates';
  addText(dates, 'dt', t('effectiveFrom'));
  addText(dates, 'dd', typeof from === 'string' && from ? from : t('notProvided'));
  addText(dates, 'dt', t('effectiveUntil'));
  addText(dates, 'dd', typeof until === 'string' && until ? until : t('notProvided'));
  addText(dates, 'dt', t('resolvedForDate'));
  addText(dates, 'dd', typeof data.asOf === 'string' && data.asOf ? data.asOf : t('notProvided'));
  contentNode.append(dates);

  // Legal Sources
  renderSources(data.sourceReferences, contentNode);

  // Supporting Legal Passages
  const supportingPassages = Array.isArray(data.supportingPassages) ? data.supportingPassages : [];
  if (supportingPassages.length) {
    const section = document.createElement('details');
    section.className = 'result-section supporting-passage passage-disclosure';
    section.open = true;
    addText(section, 'summary', t('supportingPassages'));
    for (const passage of supportingPassages) {
      const entry = document.createElement('div');
      entry.className = 'supporting-passage-entry';
      addText(entry, 'h4', `${passage.sourceTitle} — ${passage.citation}`);
      if (typeof passage.sourceVersion === 'string' && passage.sourceVersion) {
        addText(entry, 'p', passage.sourceVersion, 'muted-copy');
      }
      addText(entry, 'blockquote', passage.text);
      const href = safeUrl(passage.sourceUrl);
      if (href) {
        const link = addText(entry, 'a', t('openSource'));
        link.href = href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      section.append(entry);
    }
    contentNode.append(section);
  }

  if (includeExplainer) renderExplainer(city, canonicalItemId);
}

function renderExplainer(city, canonicalItemId) {
  const section = document.createElement('section');
  section.className = 'explainer result-section';
  addText(section, 'h3', t('explainerHeading'));
  addText(section, 'p', t('explainerCopy'), 'muted-copy');

  const thread = document.createElement('div');
  thread.className = 'explainer-thread';
  thread.setAttribute('role', 'log');
  thread.setAttribute('aria-live', 'polite');
  thread.setAttribute('aria-relevant', 'additions');

  const expForm = document.createElement('form');
  expForm.className = 'explainer-form';
  const label = addText(expForm, 'label', t('explainerQuestionLabel'));
  const question = document.createElement('textarea');
  question.id = 'explainer-question';
  question.rows = 3;
  question.maxLength = 1200;
  question.required = true;
  question.placeholder =
    currentLang === 'vi'
      ? 'Ví dụ: Tôi có cần rửa sạch trước khi bỏ không? Phường có điểm tập kết cồng kềnh ở đâu?'
      : 'e.g., Do I need to clean this first? Where is the bulky collection point?';
  question.setAttribute('aria-describedby', 'explainer-feedback');
  label.htmlFor = question.id;
  expForm.append(question);
  const submit = document.createElement('button');
  submit.className = 'button button-primary';
  submit.type = 'submit';
  submit.textContent = t('explainerSubmit');
  expForm.append(submit);

  const feedback = document.createElement('p');
  feedback.id = 'explainer-feedback';
  feedback.className = 'explainer-feedback';
  feedback.setAttribute('role', 'status');
  feedback.setAttribute('aria-live', 'polite');
  feedback.hidden = true;
  section.append(thread, expForm, feedback);
  resultContent.append(section);

  expForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const text = question.value.trim();
    if (!text) {
      feedback.textContent = currentLang === 'vi' ? 'Vui lòng nhập câu hỏi.' : 'Enter a question first.';
      feedback.classList.add('feedback-error');
      feedback.hidden = false;
      question.focus();
      return;
    }
    const version = ++explanationVersion;
    const resultVersion = requestVersion;
    const history = explanationHistory.slice(-10);
    submit.disabled = true;
    feedback.textContent = t('explainerLoading');
    feedback.classList.remove('feedback-error');
    feedback.hidden = false;
    addText(thread, 'p', text, 'explainer-user');
    const reply = document.createElement('div');
    reply.className = 'explainer-reply';
    thread.append(reply);
    try {
      const answer = await postTextStream(
        '/api/explain',
        {
          canonicalItemId,
          jurisdiction: city,
          question: text,
          history,
          confirmed: true,
        },
        (value) => {
          renderMarkdown(reply, value);
          feedback.hidden = true;
        }
      );
      if (version !== explanationVersion || resultVersion !== requestVersion) return;
      if (!answer.trim()) {
        throw new Error(
          currentLang === 'vi'
            ? 'Không nhận được câu trả lời từ hệ thống giải đáp.'
            : 'The explainer returned no answer.'
        );
      }

      explanationHistory = [...history, { role: 'user', content: text }, { role: 'assistant', content: answer }].slice(-10);
      question.value = '';
      feedback.hidden = true;
      question.focus();
    } catch (error) {
      reply.remove();
      if (version === explanationVersion && resultVersion === requestVersion) {
        feedback.textContent =
          error instanceof Error
            ? error.message
            : (currentLang === 'vi'
                ? 'Không thể hoàn tất giải đáp. Vui lòng thử lại.'
                : 'The explanation could not be retrieved. Try again.');
        feedback.classList.add('feedback-error');
        feedback.hidden = false;
      }
    } finally {
      if (version === explanationVersion && resultVersion === requestVersion) submit.disabled = false;
    }
  });
}

confirmButton.addEventListener('click', async () => {
  if (!candidate) return;
  const confirmedItem = candidate;
  const city = citySelect.value;
  const version = ++requestVersion;
  comparisonVersion++;
  explanationVersion++;
  explanationHistory = [];
  compareCitiesButton.hidden = true;
  compareCitiesButton.disabled = false;
  comparisonFeedback.textContent = '';
  comparisonPanel.hidden = true;
  comparisonPanel.replaceChildren();
  confirmButton.disabled = true;
  correctButton.disabled = true;
  resultPanel.hidden = true;
  showFeedback(
    currentLang === 'vi'
      ? `Đang tra cứu quy định hiện hành của ${cityName(city)}…`
      : `Checking active guidance for ${cityName(city)}…`
  );
  try {
    const data = await postJson('/api/resolve', {
      jurisdiction: city,
      canonicalItemId: confirmedItem.canonicalItemId,
      confirmed: true,
    });
    if (version !== requestVersion || city !== citySelect.value) return;
    recognitionFeedback.hidden = true;
    renderResolution(data, city, confirmedItem.canonicalItemId);
    compareCitiesButton.hidden = false;
    resultPanel.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  } catch (error) {
    if (version === requestVersion) {
      showFeedback(
        error instanceof Error
          ? error.message
          : (currentLang === 'vi'
              ? 'Không thể tra cứu hướng dẫn. Vui lòng thử lại.'
              : 'Could not retrieve city guidance. Please try again.'),
        true
      );
    }
  } finally {
    if (version === requestVersion) {
      confirmButton.disabled = false;
      correctButton.disabled = false;
    }
  }
});

compareCitiesButton.addEventListener('click', async () => {
  if (!candidate || compareCitiesButton.disabled) return;
  const confirmedItem = candidate;
  const version = ++comparisonVersion;
  const cities = ['hanoi', 'ho-chi-minh-city'];
  compareCitiesButton.disabled = true;
  comparisonFeedback.textContent = t('comparingCities');
  comparisonFeedback.classList.remove('feedback-error');
  comparisonFeedback.hidden = false;
  comparisonPanel.replaceChildren();

  const cards = cities.map((city) => {
    const card = document.createElement('article');
    card.className = 'comparison-card';
    addText(card, 'h3', cityName(city));
    const content = document.createElement('div');
    const status = addText(card, 'span', 'LOADING', 'status-pill status-unavailable');
    addText(
      content,
      'p',
      currentLang === 'vi' ? 'Đang tải quy định…' : 'Checking current guidance…',
      'muted-copy'
    );
    card.append(status, content);
    comparisonPanel.append(card);
    return { card, status, content };
  });
  comparisonPanel.hidden = false;

  const outcomes = await Promise.all(
    cities.map(async (jurisdiction, index) => {
      try {
        const data = await postJson('/api/resolve', {
          jurisdiction,
          canonicalItemId: confirmedItem.canonicalItemId,
          confirmed: true,
        });
        if (version !== comparisonVersion || candidate !== confirmedItem) return 'stale';
        renderResolution(data, jurisdiction, confirmedItem.canonicalItemId, {
          panel: cards[index].card,
          statusNode: cards[index].status,
          contentNode: cards[index].content,
          includeExplainer: false,
          includeCity: false,
        });
        return 'complete';
      } catch {
        if (version !== comparisonVersion || candidate !== confirmedItem) return 'stale';
        const { card, status, content } = cards[index];
        status.textContent = t('statusUnavailable');
        status.className = 'status-pill status-unavailable';
        content.replaceChildren();
        addText(
          content,
          'p',
          currentLang === 'vi'
            ? 'Không thể tải quy định cho thành phố này.'
            : 'Guidance could not be loaded for this city. Please try again.',
          'result-message'
        );
        card.hidden = false;
        return 'failed';
      }
    })
  );
  if (version !== comparisonVersion || candidate !== confirmedItem) return;
  const failed = outcomes.includes('failed');
  comparisonFeedback.textContent = failed ? t('comparisonFailed') : t('comparisonComplete');
  comparisonFeedback.classList.toggle('feedback-error', failed);
  compareCitiesButton.disabled = false;
});

// Setup language switcher buttons
for (const btn of langButtons) {
  btn.addEventListener('click', () => {
    setLanguage(btn.dataset.lang);
  });
}

// Initial setup
setupStreamTabs();
setLanguage(currentLang);
