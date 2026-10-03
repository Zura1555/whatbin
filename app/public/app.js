// WhatBin — Frontend Application with Bilingual Support & Stream-based Catalog

const CANONICAL_CATALOG = [
  // 1. Recyclables (Tái chế)
  {
    id: 'pet-plastic-bottle',
    stream: 'recyclables',
    tagVi: 'Bán ve chai',
    tagEn: 'Scrap sell',
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
    tagVi: 'Bán ve chai',
    tagEn: 'Scrap sell',
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
    tagVi: 'Bán ve chai',
    tagEn: 'Scrap sell',
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
    tagVi: 'Ve chai / Tái chế',
    tagEn: 'Recycle / Scrap',
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
    tagVi: 'Tái sử dụng',
    tagEn: 'Reuse',
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
    tagVi: 'Quyên góp',
    tagEn: 'Donation',
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
    tagVi: 'Điểm thu gom',
    tagEn: 'Drop-off',
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
    tagVi: 'Thu hồi EPR',
    tagEn: 'EPR take-back',
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
    tagVi: 'Ve chai / EPR',
    tagEn: 'Scrap / EPR',
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
    tagVi: 'Thu hồi EPR',
    tagEn: 'EPR take-back',
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
    tagVi: 'Rác điện tử',
    tagEn: 'E-waste',
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
    tagVi: 'Thu hồi EPR',
    tagEn: 'EPR take-back',
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
    tagVi: 'Rác hữu cơ',
    tagEn: 'Organics',
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
    tagVi: 'Ủ phân compost',
    tagEn: 'Compost',
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
    tagVi: 'Mùn cây / Ủ phân',
    tagEn: 'Mulch / Compost',
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
    tagVi: 'Bón cây cảnh',
    tagEn: 'Fertilizer',
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
    tagVi: 'Điểm thu hồi pin',
    tagEn: 'Battery drop-off',
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
    tagVi: 'Chống cháy / CTNH',
    tagEn: 'Fire risk / CTNH',
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
    tagVi: 'Thu hồi EPR',
    tagEn: 'EPR take-back',
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
    tagVi: 'Thủy ngân / CTNH',
    tagEn: 'Mercury / CTNH',
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
    tagVi: 'Độc hại / CTNH',
    tagEn: 'Toxic / CTNH',
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
    tagVi: 'Trạm y tế',
    tagEn: 'Clinic / Pharmacy',
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
    tagVi: 'Áp suất / CTNH',
    tagEn: 'Pressurized / CTNH',
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
    tagVi: 'Độc cao / CTNH',
    tagEn: 'Toxic / CTNH',
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
    tagVi: 'Tiệm xe máy',
    tagEn: 'Repair shop',
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
    tagVi: 'Đại lý EPR',
    tagEn: 'EPR dealer',
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
    tagVi: 'Sắc nhọn / Y tế',
    tagEn: 'Sharps / Clinic',
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
    tagVi: 'Dung môi / CTNH',
    tagEn: 'Solvent / CTNH',
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
    tagVi: 'Hóa chất / CTNH',
    tagEn: 'Chemical / CTNH',
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
    tagVi: 'Hẹn xe trả phí',
    tagEn: 'Paid pickup',
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
    tagVi: 'Điểm tập kết',
    tagEn: 'Drop-off hub',
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
    tagVi: 'Hẹn xe trả phí',
    tagEn: 'Paid pickup',
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
    tagVi: 'Tiệm xe / EPR',
    tagEn: 'Tire / EPR',
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
    tagVi: 'Xe xà bần',
    tagEn: 'Rubble truck',
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
    tagVi: 'Xe chuyên dụng',
    tagEn: 'Special hauler',
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
    tagVi: 'Đốt phát điện',
    tagEn: 'Waste-to-energy',
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
    tagVi: 'Rác đốt',
    tagEn: 'Incinerate',
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
    tagVi: 'Rác đốt kín',
    tagEn: 'Residual trash',
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
    tagVi: 'Bọc kỹ / Chôn lấp',
    tagEn: 'Wrap / Landfill',
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
    tagVi: 'Rác đốt',
    tagEn: 'Incinerate',
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
    tagVi: 'Rác còn lại',
    tagEn: 'Residual trash',
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
    tagVi: 'Rác đốt',
    tagEn: 'Incinerate',
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
    tagVi: 'Rác đốt',
    tagEn: 'Incinerate',
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
    tagVi: 'Rác đốt',
    tagEn: 'Incinerate',
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
    tagVi: 'Rác đốt kín',
    tagEn: 'Residual trash',
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
    tagVi: 'Dập nguội / Rác khác',
    tagEn: 'Cooled / Residual',
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
    tagVi: 'Tái chế Biodiesel',
    tagEn: 'Biodiesel recovery',
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
    modeCatalog: 'Danh mục 5 nhóm',
    modeText: 'Mô tả / Giọng nói',
    modePhoto: 'Chụp ảnh AI',
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
    quickNavQuiz: 'Trắc nghiệm phân loại',
    quickNavDropoff: 'Điểm thu gom & EPR',
    quickNavPrint: 'In cẩm nang',
    voiceSearchTitle: 'Tìm kiếm bằng giọng nói',
    voiceListening: 'Đang lắng nghe… Hãy nói tên hoặc mô tả vật dụng.',
    voiceSuccess: 'Đã nhận diện giọng nói. Bấm Nhận diện để tra cứu.',
    voiceNotSupported: 'Trình duyệt chưa hỗ trợ nhận diện giọng nói Web Speech.',
    voicePermissionDenied: 'Chưa được cấp quyền sử dụng microphone.',
    voiceNoSpeech: 'Không nghe thấy giọng nói. Vui lòng thử lại.',
    retakePhoto: 'Chọn ảnh khác',
    bagStandardLabel: 'Quy cách bao bì / túi rác chuẩn',
    bagBadgeFood: 'Túi xanh lá / Thùng rác hữu cơ',
    bagBadgeRecyclables: 'Túi trong suốt / Thùng tái chế (xanh dương)',
    bagBadgeOther: 'Túi xám hoặc sẫm màu / Rác sinh hoạt khác',
    bagBadgeHazardous: 'Hộp / Túi riêng có dán nhãn nguy hại',
    bagBadgeBulky: 'Điểm tập kết cồng kềnh / Xe chuyên dụng',
    decreeNoticeHeading: 'Nghị định 45/2022/NĐ-CP (Điều 26)',
    decreeNoticeText: 'Phạt tiền từ 500.000 – 1.000.000 đồng đối với hộ gia đình, cá nhân không thực hiện phân loại chất thải rắn sinh hoạt tại nguồn hoặc không dùng đúng loại bao bì/thùng chứa theo quy định.',
    quizModalTitle: 'Trắc nghiệm phân loại rác tại nguồn',
    quizQuestionCounter: 'Câu hỏi {current} / {total}',
    quizNextBtn: 'Câu tiếp theo →',
    quizFinishBtn: 'Xem kết quả tổng kết →',
    quizRetakeBtn: 'Làm lại trắc nghiệm',
    quizShareBtn: 'Sao chép kết quả',
    quizCopied: 'Đã sao chép kết quả vào bộ nhớ tạm!',
    quizScoreMaster: 'Xuất sắc! 5/5 Chuyên gia phân loại rác!',
    quizScoreGood: 'Rất tốt! Bạn nắm khá vững quy định phân loại rác!',
    quizScorePractice: 'Cần cố gắng thêm! Hãy tra cứu WhatBin để phân loại chuẩn nhé.',
    dropoffModalTitle: 'Điểm thu gom tập trung & Thu hồi EPR',
    dropoffIntro: 'Mạng lưới điểm tập kết rác cồng kềnh, điểm tiếp nhận chất thải nguy hại hộ gia đình và trạm thu hồi pin, rác điện tử miễn phí tại Hà Nội & TP.HCM.',
    filterCityLabel: 'Thành phố:',
    filterStreamLabel: 'Nhóm rác:',
    filterAll: 'Tất cả',
    printGuideTitle: 'CẨM NANG PHÂN LOẠI RÁC TẠI NGUỒN GIA ĐÌNH',
    printGuideSubtitle: 'Áp dụng theo Quyết định 87/2024/QĐ-UBND (Hà Nội) & Quyết định 36/2025/QĐ-UBND, 58/2025/QĐ-UBND (TP.HCM)',
    printDecreeHeading: 'NGHỊ ĐỊNH 45/2022/NĐ-CP (ĐIỀU 26):',
    printDecreeNotice: 'Phạt tiền từ 500.000 đến 1.000.000 đồng đối với hộ gia đình, cá nhân không thực hiện phân loại chất thải rắn sinh hoạt tại nguồn hoặc không dùng đúng loại bao bì/thùng chứa theo quy định.',
    printFoodTitle: 'CHẤT THẢI THỰC PHẨM',
    printFoodBadge: 'Túi xanh lá / Thùng rác hữu cơ',
    printFoodDos: 'Cơm thừa, rau củ quả gọt vỏ, bã trà, bã cà phê, thức ăn nấu chín thừa, hoa lá quét dọn vườn nhỏ.',
    printFoodDonts: 'Vỏ dừa, vỏ sầu riêng, xương động vật lớn, túi ni lông, vỏ sò ốc cứng, tã lót.',
    printRecycleTitle: 'TÁI SỬ DỤNG & TÁI CHẾ',
    printRecycleBadge: 'Túi trong suốt / Thùng màu xanh dương',
    printRecycleDos: 'Chai nhựa PET, lon nhôm, vỏ hộp sữa Tetra Pak, bìa carton, chai lọ thủy tinh sạch, giấy báo, thiết bị điện tử hỏng.',
    printRecycleDonts: 'Tráng sạch cặn thức ăn, để ráo, ép dẹp hoặc gấp gọn để tiết kiệm diện tích. Bán phế liệu hoặc đưa vào nhóm thu gom tái chế.',
    printOtherTitle: 'RÁC SINH HOẠT KHÁC',
    printOtherBadge: 'Túi xám hoặc sẫm màu',
    printOtherDos: 'Hộp xốp dính dầu mỡ, túi ni lông bẩn, tã bỉm, băng vệ sinh, khẩu trang dùng 1 lần, gốm sứ vỡ, tàn hương, vỏ dừa/sầu riêng.',
    printOtherDonts: 'Buộc chặt miệng túi trước khi chuyển giao. Thu gom vào giờ quy định của công nhân vệ sinh đô thị.',
    printHazardTitle: 'CHẤT THẢI NGUY HẠI',
    printHazardBadge: 'Hộp / Túi riêng có dán nhãn nguy hại',
    printHazardDos: 'Pin tiểu AA/AAA, pin lithium, ắc quy xe máy, sạc dự phòng, bóng đèn huỳnh quang, nhiệt kế thủy ngân, bao bì thuốc sâu, nhớt thải.',
    printHazardDonts: 'Dán băng dính vào 2 cực pin, bọc báo chống vỡ bóng đèn, không đổ nhớt ra cống. Đưa tới thùng thu gom CTNH cấp phường/xã.',
    printBulkyTitle: 'CHẤT THẢI CỒNG KỀNH',
    printBulkyBadge: 'Điểm tập kết cồng kềnh / Xe chuyên dụng',
    printBulkyDos: 'Nệm cũ, ghế sofa, bàn ghế gỗ, tủ giường, cành cây to chặt hạ, xà bần sửa nhà nhỏ.',
    printBulkyDonts: 'Tuyệt đối không tự ý vứt ra lòng lề đường. Đăng ký với UBND xã/phường hoặc đặt lịch đơn vị vệ sinh môi trường thu gom chuyên dụng.',
    printDoLabel: '✔ ĐƯỢC BỎ:',
    printDontLabel: '✖ KHÔNG BỎ / LƯU Ý:',
    printNoteLabel: '⚡ HƯỚNG DẪN:',
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
    modeCatalog: '5 Waste Streams',
    modeText: 'Describe / Voice',
    modePhoto: 'AI Camera',
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
    quickNavQuiz: 'Sorting Quiz',
    quickNavDropoff: 'Drop-off Hubs & EPR',
    quickNavPrint: 'Print Wall Guide',
    voiceSearchTitle: 'Voice search',
    voiceListening: 'Listening… Speak the item name or description.',
    voiceSuccess: 'Voice recognized. Tap Identify to look up.',
    voiceNotSupported: 'Speech recognition is not supported in this browser.',
    voicePermissionDenied: 'Microphone permission denied.',
    voiceNoSpeech: 'No speech heard. Please try again.',
    retakePhoto: 'Change photo',
    bagStandardLabel: 'Official Bag / Bin Standard',
    bagBadgeFood: 'Green Bag / Organic Bin',
    bagBadgeRecyclables: 'Transparent Bag / Blue Recycling Bin',
    bagBadgeOther: 'Gray/Dark Bag / General Residual Waste',
    bagBadgeHazardous: 'Separate Labeled Hazard Container',
    bagBadgeBulky: 'Bulky Waste Collection Point / Truck',
    decreeNoticeHeading: 'Decree 45/2022/NĐ-CP (Article 26)',
    decreeNoticeText: 'Fine of 500,000 – 1,000,000 VND for failure to segregate household solid waste at source or failing to use prescribed standard bags/bins.',
    quizModalTitle: 'Household Waste Sorting Quiz',
    quizQuestionCounter: 'Question {current} of {total}',
    quizNextBtn: 'Next question →',
    quizFinishBtn: 'View final score →',
    quizRetakeBtn: 'Retake quiz',
    quizShareBtn: 'Copy score result',
    quizCopied: 'Score result copied to clipboard!',
    quizScoreMaster: 'Outstanding! 5/5 Waste Sorting Master!',
    quizScoreGood: 'Great job! You know the sorting rules well!',
    quizScorePractice: 'Keep practicing! Use WhatBin to avoid sorting penalties.',
    dropoffModalTitle: 'Drop-off Points & EPR Directory',
    dropoffIntro: 'Directory of bulky waste drop-off hubs, municipal hazardous collection points, and free e-waste/battery take-back sites in Hanoi & HCMC.',
    filterCityLabel: 'City:',
    filterStreamLabel: 'Waste stream:',
    filterAll: 'All',
    printGuideTitle: 'HOUSEHOLD WASTE SORTING WALL GUIDE',
    printGuideSubtitle: 'Standards under Decision 87/2024 (Hanoi) & Decision 36/2025, 58/2025 (HCMC)',
    printDecreeHeading: 'DECREE 45/2022/NĐ-CP (ARTICLE 26):',
    printDecreeNotice: 'Fine of 500,000 to 1,000,000 VND for households and individuals who fail to classify domestic solid waste at source or fail to use prescribed containers/bags.',
    printFoodTitle: 'FOOD WASTE',
    printFoodBadge: 'Green bag / Organic bin',
    printFoodDos: 'Leftover cooked food, fruit and vegetable scraps, tea leaves, coffee grounds, small garden clippings.',
    printFoodDonts: 'Coconut shells, durian rinds, large animal bones, plastic bags, hard shells, diapers.',
    printRecycleTitle: 'REUSABLE & RECYCLABLE',
    printRecycleBadge: 'Transparent bag / Blue recycling bin',
    printRecycleDos: 'PET plastic bottles, aluminum cans, Tetra Pak cartons, cardboard boxes, clean glass jars, newspapers, old electronics.',
    printRecycleDonts: 'Rinse clean, drain, flatten to save volume. Sell to scrap buyers or hand over to recycling collection.',
    printOtherTitle: 'OTHER DOMESTIC SOLID WASTE',
    printOtherBadge: 'Gray or dark-colored bag',
    printOtherDos: 'Greasy foam takeout boxes, soiled plastic bags, disposable diapers, medical masks, broken ceramic, ash, durian husks.',
    printOtherDonts: 'Tie bag tightly before transferring to municipal collection trucks at designated hours.',
    printHazardTitle: 'HOUSEHOLD HAZARDOUS WASTE',
    printHazardBadge: 'Dedicated container labeled HAZARDOUS',
    printHazardDos: 'Spent AA/AAA batteries, lithium cells, motorbike accumulators, power banks, fluorescent tubes, mercury thermometers, pesticide cans, used motor oil.',
    printHazardDonts: 'Tape battery terminals, wrap fragile tubes, never dump oil into sinks. Hand over to ward hazardous hubs.',
    printBulkyTitle: 'BULKY DOMESTIC WASTE',
    printBulkyBadge: 'Bulky collection hub / Specialized vehicle',
    printBulkyDos: 'Old mattresses, sofas, wooden tables/chairs, bed frames, large pruned branches, small renovation rubble.',
    printBulkyDonts: 'Never discard on sidewalks. Schedule collection with ward authorities or licensed waste contractors.',
    printDoLabel: '✔ ACCEPTED:',
    printDontLabel: '✖ DO NOT INCLUDE:',
    printNoteLabel: '⚡ INSTRUCTION:',
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

const HEROICONS = {
  food: '<svg class="hi-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582" /></svg>',
  recyclables: '<svg class="hi-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0 3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" /></svg>',
  other: '<svg class="hi-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>',
  hazardous: '<svg class="hi-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>',
  bulky: '<svg class="hi-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V18.75m0-11.25h-9a2.25 2.25 0 0 0-2.25 2.25v7.5" /></svg>',
  scale: '<svg class="hi-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" /></svg>',
  mapPin: '<svg class="hi-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>',
  checkCircle: '<svg class="hi-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>',
  xCircle: '<svg class="hi-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>',
  trophy: '<svg class="hi-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871a8.263 8.263 0 0 0-3.008 0h-.871c-.621 0-1.125.504-1.125 1.125V18.75m9 0h-9m9-11.25V5.25a2.25 2.25 0 0 0-2.25-2.25h-4.5A2.25 2.25 0 0 0 4.5 5.25v2.25m12 0A4.5 4.5 0 0 1 12 12a4.5 4.5 0 0 1-4.5-4.5m12 0H18m-13.5 0H6" /></svg>',
  sparkles: '<svg class="hi-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>',
  academicCap: '<svg class="hi-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-5.25 6.557q.217.375.467.732m4.783-7.289a55.437 55.437 0 0 1 5.25 2.882V15m-5.25-2.882q-.314.159-.625.32" /></svg>',
};

const STREAM_META = {
  recyclables: {
    titleVi: 'Tái chế & Phế liệu',
    titleEn: 'Recyclables & Scrap',
    descVi: 'Thu gom khô sạch, ép gọn bán ve chai hoặc gửi điểm thu hồi tái chế.',
    descEn: 'Keep dry & clean, flatten to sell as scrap or deposit at recycling hubs.',
    icon: HEROICONS.recyclables,
  },
  food: {
    titleVi: 'Rác thực phẩm',
    titleEn: 'Food & Organics',
    descVi: 'Gạn sạch nước, ủ phân hữu cơ hoặc giao đơn vị thu gom rác dễ phân hủy hàng ngày.',
    descEn: 'Drain liquids, compost or hand over for daily municipal organic collection.',
    icon: HEROICONS.food,
  },
  hazardous: {
    titleVi: 'Chất thải nguy hại',
    titleEn: 'Household Hazardous',
    descVi: 'Độc hại & nguy cơ cháy nổ — Tách riêng gửi điểm thu hồi CTNH cấp xã/phường.',
    descEn: 'Toxic & flammable risk — Keep separate and deliver to municipal drop-off hubs.',
    icon: HEROICONS.hazardous,
  },
  bulky: {
    titleVi: 'Rác cồng kềnh',
    titleEn: 'Bulky Waste',
    descVi: 'Kích thước lớn — Đăng ký dịch vụ thu gom trả phí hoặc tự chở ra điểm tập kết.',
    descEn: 'Oversized items — Book municipal paid pickup or transport to ward collection hubs.',
    icon: HEROICONS.bulky,
  },
  other: {
    titleVi: 'Rác sinh hoạt còn lại',
    titleEn: 'Residual Waste',
    descVi: 'Chứa túi kín chuyển nhà máy đốt rác phát điện hoặc bãi chôn lấp.',
    descEn: 'Pack securely for waste-to-energy incineration or sanitary landfill.',
    icon: HEROICONS.other,
  },
};

const BAG_BADGE_INFO = {
  food: {
    icon: HEROICONS.food,
    badgeClass: 'bag-badge-food',
    titleKey: 'bagBadgeFood',
    subVi: 'Quy chuẩn QĐ 87/2024 (Hà Nội) & QĐ 36/2025 (TP.HCM)',
    subEn: 'Standard under Dec. 87 (Hanoi) & Dec. 36/58 (HCMC)',
  },
  recyclables: {
    icon: HEROICONS.recyclables,
    badgeClass: 'bag-badge-recyclables',
    titleKey: 'bagBadgeRecyclables',
    subVi: 'Túi trong suốt thấy rõ phế liệu hoặc thùng tái chế màu xanh dương',
    subEn: 'Transparent bags showing recyclable materials or blue bin',
  },
  other: {
    icon: HEROICONS.other,
    badgeClass: 'bag-badge-other',
    titleKey: 'bagBadgeOther',
    subVi: 'Túi rác xám hoặc sẫm màu chứa chất thải còn lại',
    subEn: 'Opaque dark bag for general domestic residual waste',
  },
  hazardous: {
    icon: HEROICONS.hazardous,
    badgeClass: 'bag-badge-hazardous',
    titleKey: 'bagBadgeHazardous',
    subVi: 'Phân loại riêng trong bao bì có cảnh báo, không để lẫn rác sinh hoạt',
    subEn: 'Segregate in labeled container, never mix with common garbage',
  },
  bulky: {
    icon: HEROICONS.bulky,
    badgeClass: 'bag-badge-bulky',
    titleKey: 'bagBadgeBulky',
    subVi: 'Tập kết tại trạm cấp xã/phường hoặc hẹn xe chuyên dùng thu gom',
    subEn: 'Deliver to commune drop-off hub or schedule specialized collection',
  },
};

const QUIZ_QUESTIONS = [
  {
    id: 1,
    questionVi: 'Vỏ dừa hoặc vỏ sầu riêng sau khi ăn xong nên bỏ vào đâu?',
    questionEn: 'Where should discarded coconut shells or durian husks go?',
    optionsVi: [
      'Chất thải thực phẩm (đem đi ủ phân compost)',
      'Chất thải sinh hoạt khác (không thể phân hủy trong máy ủ compost)',
      'Chất thải tái chế',
      'Chất thải nguy hại',
    ],
    optionsEn: [
      'Food waste (composting)',
      'Other domestic waste (cannot decompose in municipal composting machines)',
      'Recyclables',
      'Household hazardous waste',
    ],
    correctIndex: 1,
    feedbackVi: 'Chính xác! Theo Quyết định 87/2024/QĐ-UBND (Hà Nội) và Quyết định 36/2025/QĐ-UBND (TP.HCM), vỏ dừa khô và vỏ sầu riêng có cấu trúc xơ gỗ cứng khó phân hủy sinh học, làm kẹt hoặc hư hỏng thiết bị nghiền và công nghệ ủ compost vi sinh, nên được xếp vào nhóm "Chất thải rắn sinh hoạt khác" (rác khác).',
    feedbackEn: 'Correct! Under Hanoi Decision 87 and HCMC Decision 36/58, hard woody rinds like coconut shells and durian husks cannot biodegrade in municipal compost digesters and clog grinding machinery; they belong in "Other domestic solid waste".',
  },
  {
    id: 2,
    questionVi: 'Hộp xốp đựng thức ăn dính nhiều dầu mỡ xử lý thế nào?',
    questionEn: 'How should takeout polystyrene foam boxes soiled with grease be handled?',
    optionsVi: [
      'Bỏ vào thùng rác tái chế cùng chai nhựa',
      'Bỏ vào nhóm rác sinh hoạt khác (dầu mỡ làm bẩn dây chuyền tái chế)',
      'Bỏ vào rác thực phẩm',
      'Bỏ vào rác nguy hại',
    ],
    optionsEn: [
      'Place in recycling bin with plastic bottles',
      'Dispose of as other domestic waste (grease contaminates recycling streams)',
      'Put in food waste bin',
      'Put in hazardous waste',
    ],
    correctIndex: 1,
    feedbackVi: 'Chính xác! Hộp xốp (nhựa EPS) dính dầu mỡ thực phẩm rất khó làm sạch triệt để. Dầu mỡ bám dính làm biến chất nguyên liệu và dây chuyền tái chế từ chối tiếp nhận. Căn cứ Quyết định 87 & Quyết định 36/58, hộp xốp dính dầu mỡ phải bỏ vào nhóm "Rác sinh hoạt khác".',
    feedbackEn: 'Correct! Food-soiled expanded polystyrene foam is difficult to clean economically. Grease contaminates the recycling process, so municipal regulations (Dec. 87 & Dec. 36/58) classify it as "Other domestic solid waste".',
  },
  {
    id: 3,
    questionVi: 'Vỏ hộp sữa giấy nhiều lớp (Tetra Pak) nên xử lý thế nào trước khi bỏ?',
    questionEn: 'How should multi-layer Tetra Pak beverage cartons be handled before disposal?',
    optionsVi: [
      'Mở 4 góc tai hộp, tráng sạch, ép dẹp và gom vào nhóm tái chế',
      'Bỏ ngay vào rác thực phẩm vì làm từ bột giấy hữu cơ',
      'Vứt vào rác sinh hoạt khác mà không cần rửa',
      'Bỏ vào thùng rác nguy hại',
    ],
    optionsEn: [
      'Unfold 4 flaps, rinse clean, flatten, and put in recyclables',
      'Toss into food waste because it is made of paperboard',
      'Discard with general trash without cleaning',
      'Place in hazardous waste',
    ],
    correctIndex: 0,
    feedbackVi: 'Chính xác! Vỏ hộp sữa giấy nhiều lớp gồm giấy chất lượng cao, màng nhôm và nhựa. Người dân cần mở 4 góc tai, súc sạch sữa thừa để tránh lên men chua bốc mùi, ép dẹp và bàn giao cho nhóm "Tái sử dụng, tái chế" hoặc các điểm thu hồi vỏ hộp sữa tại siêu thị, trường học.',
    feedbackEn: 'Correct! Multi-layer aseptic cartons contain premium pulp, aluminum, and polymers. Unfolding the 4 corners, rinsing out residual milk, and flattening enables clean recovery at specialized paper mills.',
  },
  {
    id: 4,
    questionVi: 'Dầu ăn thừa sau khi chiên rán có được đổ trực tiếp xuống bồn rửa bát không?',
    questionEn: 'Can leftover used cooking oil be poured down the kitchen sink?',
    optionsVi: [
      'Được, chỉ cần xả nhiều nước nóng và nước rửa chén',
      'Tuyệt đối không; dầu mỡ đông đặc gây tắc cống và ô nhiễm nước, phải thu gom riêng',
      'Đổ trực tiếp vào chậu hoa cây cảnh',
      'Đổ vào thùng rác thực phẩm dạng lỏng',
    ],
    optionsEn: [
      'Yes, as long as flushed with dish soap and boiling water',
      'Never; solidified grease creates fatbergs, clogs sewers, and must be collected separately',
      'Pour directly into houseplants',
      'Pour into liquid food waste bin',
    ],
    correctIndex: 1,
    feedbackVi: 'Chính xác! Dầu mỡ thừa khi chảy vào cống thoát nước gặp nhiệt độ thấp sẽ đông cứng tạo thành các khối mỡ khổng lồ (fatberg) làm vỡ cống ngầm đô thị và gây tê liệt vi sinh xử lý nước thải. Hộ gia đình nên để nguội, đổ vào chai đậy kín để giao cho đơn vị tái chế dầu/biodiesel (Quyết định 87 Điều 7 & Quyết định 36).',
    feedbackEn: 'Correct! Cooking grease congeals inside sewer pipes into solid fatbergs, causing severe blockages and municipal sewage overflow. Households should bottle cool spent oil and transfer it to designated oil recyclers (Dec. 87 Art. 7 & Dec. 36).',
  },
  {
    id: 5,
    questionVi: 'Pin tiểu AA/AAA và sạc dự phòng cũ hỏng xử lý thế nào?',
    questionEn: 'How should spent AA/AAA batteries and broken power banks be disposed of?',
    optionsVi: [
      'Bỏ chung vào túi rác sinh hoạt hàng ngày',
      'Đốt cùng rác vườn',
      'Là rác nguy hại; dán băng dính cách điện 2 cực và mang đến điểm thu gom nguy hại/EPR',
      'Bỏ vào thùng rác tái chế nhựa',
    ],
    optionsEn: [
      'Throw into daily domestic garbage',
      'Burn together with garden waste',
      'They are hazardous waste; tape both terminals and take to designated hazardous/EPR drop-off points',
      'Toss into plastic recycling bin',
    ],
    correctIndex: 2,
    feedbackVi: 'Chính xác! Pin tiểu chứa chì, cadmium, thủy ngân; pin lithium trong sạc dự phòng dễ phát nổ khi bị máy ép rác nghiền. Theo Nghị định 45/2022/NĐ-CP, Quyết định 87 (Hà Nội) và Quyết định 58/2025 (TP.HCM), pin phải thu gom riêng, dán băng dính cách điện 2 cực và đưa tới điểm thu hồi CTNH cấp phường/xã.',
    feedbackEn: 'Correct! Batteries contain hazardous heavy metals and volatile lithium cells that catch fire under trash truck compaction. Under Decree 45 and Hanoi Dec. 87 / HCMC Dec. 58/2025, tape terminals and deliver them to ward hazardous/EPR collection hubs.',
  },
];

const DROPOFF_HUBS = [
  {
    id: 'hn-bulky',
    city: 'hanoi',
    stream: 'bulky',
    titleVi: 'Điểm tập kết rác cồng kềnh cấp xã/phường (Hà Nội)',
    titleEn: 'Commune Bulky Waste Hubs (Hanoi)',
    badgeVi: 'Rác cồng kềnh · QĐ 87/2024 Điều 6(5)',
    badgeEn: 'Bulky Waste · Dec. 87 Art. 6(5)',
    addressVi: 'UBND các xã, phường, thị trấn trên toàn địa bàn Hà Nội (tối thiểu 01 điểm/xã hoặc xe cuốn ép chuyên dùng định kỳ)',
    addressEn: 'Ward & commune People\'s Committees across Hanoi (minimum 1 hub per commune or scheduled specialized compaction trucks)',
    notesVi: 'Tiếp nhận đệm mút cũ, sofa, giường tủ gỗ, cành cây to. Đăng ký trước với Tổ trưởng dân phố hoặc Đội môi trường URENCO quận/huyện.',
    notesEn: 'Accepts old mattresses, sofas, furniture, large tree branches. Register with neighborhood leader or district URENCO.',
  },
  {
    id: 'hn-hazardous',
    city: 'hanoi',
    stream: 'hazardous',
    titleVi: 'Thùng thu hồi pin cũ & CTNH tại UBND phường & URENCO',
    titleEn: 'Battery & Hazardous Drop-off Points at Ward Offices & URENCO',
    badgeVi: 'Chất thải nguy hại · Thu gom miễn phí',
    badgeEn: 'Hazardous Waste · Free Drop-off',
    addressVi: 'Trụ sở UBND các phường (Hoàn Kiếm, Ba Đình, Đống Đa, Cầu Giấy, Hai Bà Trưng, v.v.), Nhà văn hóa tổ dân phố và các trường học',
    addressEn: 'Ward People\'s Committee headquarters (Hoan Kiem, Ba Dinh, Dong Da, Cau Giay...), cultural community centers, schools',
    notesVi: 'Tiếp nhận pin AA/AAA, bóng đèn huỳnh quang bọc giấy báo, nhiệt kế thủy ngân hỏng. Dán băng dính vào 2 cực pin trước khi bỏ thùng.',
    notesEn: 'Accepts AA/AAA batteries, newspaper-wrapped fluorescent tubes, mercury thermometers. Tape terminals before dropping off.',
  },
  {
    id: 'hcm-hazardous',
    city: 'ho-chi-minh-city',
    stream: 'hazardous',
    titleVi: 'Điểm tiếp nhận CTNH hộ gia đình 22 quận/huyện & TP. Thủ Đức',
    titleEn: 'Household Hazardous Waste Hubs across 22 Districts & Thu Duc City',
    badgeVi: 'Chất thải nguy hại · QĐ 58/2025 & QĐ 36/2025',
    badgeEn: 'Hazardous Waste · Dec. 58/2025 & Dec. 36/2025',
    addressVi: 'Các trạm trung chuyển rác thải & điểm tiếp nhận cố định của Phòng TN&MT tại 22 quận, huyện và TP. Thủ Đức',
    addressEn: 'Waste transfer stations & designated Natural Resources & Environment receiving hubs in 22 districts & Thu Duc City',
    notesVi: 'Tiếp nhận pin cũ, ắc quy, bóng đèn hỏng, vỏ chai lọ thuốc trừ sâu gia dụng, sơn tồn dư, hóa chất tẩy rửa.',
    notesEn: 'Accepts batteries, accumulators, broken bulbs, pesticide canisters, leftover household paint, cleaning chemicals.',
  },
  {
    id: 'hcm-recycles',
    city: 'ho-chi-minh-city',
    stream: 'recyclables',
    titleVi: 'Mạng lưới thu hồi rác điện tử miễn phí Việt Nam Tái Chế',
    titleEn: 'Vietnam Recycles Free E-Waste Take-back Network',
    badgeVi: 'Rác điện tử (EPR) · Tiếp nhận miễn phí',
    badgeEn: 'E-Waste (EPR) · Free Drop-off',
    addressVi: 'Thùng thu hồi cố định tại UBND P.9 (Q.3), UBND P.15 (Q.4), UBND P.17 (Phú Nhuận), UBND P.2 (Bình Thạnh) & chuỗi AEON Mall, MM Mega Market, BigC/GO!',
    addressEn: 'Fixed bins at Ward 9 (Dist. 3), Ward 15 (Dist. 4), Ward 17 (Phu Nhuan), Ward 2 (Binh Thanh) & AEON Malls, MM Mega Market, BigC/GO!',
    notesVi: 'Tiếp nhận điện thoại di động, laptop, pin sạc dự phòng, máy in, TV, đồ điện gia dụng cũ hỏng để tháo dỡ xử lý theo chuẩn EPR.',
    notesEn: 'Accepts mobile phones, laptops, power banks, printers, televisions, home appliances for environmentally sound EPR recycling.',
  },
  {
    id: 'nationwide-oil',
    city: 'all',
    stream: 'hazardous',
    titleVi: 'Điểm thu hồi dầu nhớt xe máy thải & bình ắc quy chì (EPR)',
    titleEn: 'Motorbike Motor Oil & Lead-Acid Accumulator EPR Return Hubs',
    badgeVi: 'Nhớt thải & Ắc quy · Trạm bảo dưỡng ủy quyền',
    badgeEn: 'Waste Oil & Accumulator · Authorized Stations',
    addressVi: 'Hệ thống HEAD Honda, Yamaha Town và các trạm dịch vụ bảo dưỡng xe máy chính hãng trên toàn quốc',
    addressEn: 'Nationwide network of authorized Honda HEADs, Yamaha Towns, and certified vehicle maintenance workshops',
    notesVi: 'Thu hồi dầu nhớt động cơ đã qua sử dụng và ắc quy chì xe máy thải bỏ. Tuyệt đối không đổ dầu nhớt thải xuống cống thoát nước sinh hoạt.',
    notesEn: 'Collection of spent engine oil and discarded motorcycle batteries. Strictly never dump motor oil into domestic sewage.',
  },
];

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
const imagePreviewMeta = document.querySelector('#image-preview-meta');
const removeImageButton = document.querySelector('#remove-image-button');
const retakeImageButton = document.querySelector('#retake-image-button');
const voiceSearchBtn = document.querySelector('#voice-search-btn');
const voiceStatus = document.querySelector('#voice-status');
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
const streamBanner = document.querySelector('#stream-banner');
const langButtons = document.querySelectorAll('.lang-btn');

// Quick Nav & Modals DOM
const openQuizBtn = document.querySelector('#open-quiz-btn');
const footerQuizBtn = document.querySelector('#footer-quiz-btn');
const quizModal = document.querySelector('#quiz-modal');
const quizBackdrop = document.querySelector('#quiz-backdrop');
const quizCloseBtn = document.querySelector('#quiz-close-btn');
const quizBody = document.querySelector('#quiz-body');

const openDropoffBtn = document.querySelector('#open-dropoff-btn');
const footerDropoffBtn = document.querySelector('#footer-dropoff-btn');
const dropoffModal = document.querySelector('#dropoff-modal');
const dropoffBackdrop = document.querySelector('#dropoff-backdrop');
const dropoffCloseBtn = document.querySelector('#dropoff-close-btn');
const dropoffList = document.querySelector('#dropoff-list');
const dropoffCityFilters = document.querySelector('#dropoff-city-filters');
const dropoffStreamFilters = document.querySelector('#dropoff-stream-filters');

const printGuideBtn = document.querySelector('#print-guide-btn');
const footerPrintBtn = document.querySelector('#footer-print-btn');

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

// Quiz State
let quizCurrentIndex = 0;
let quizScore = 0;
let quizUserAnswers = [];

// Drop-off State
let dropoffActiveCity = 'all';
let dropoffActiveStream = 'all';

// Voice Search State
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognitionInstance = null;
let isListening = false;

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

  // Update titles & aria-labels
  for (const el of document.querySelectorAll('[data-i18n-title]')) {
    const key = el.dataset.i18nTitle;
    if (key && TRANSLATIONS[lang]?.[key]) el.title = TRANSLATIONS[lang][key];
  }
  for (const el of document.querySelectorAll('[data-i18n-aria-label]')) {
    const key = el.dataset.i18nAriaLabel;
    if (key && TRANSLATIONS[lang]?.[key]) el.setAttribute('aria-label', TRANSLATIONS[lang][key]);
  }

  // Update speech recognition language if initialized
  if (recognitionInstance) {
    recognitionInstance.lang = lang === 'vi' ? 'vi-VN' : 'en-US';
  }

  // Update quiz if active
  if (quizModal && !quizModal.hidden) {
    renderQuizQuestion();
  }

  // Update dropoff list if active
  if (dropoffModal && !dropoffModal.hidden) {
    renderDropoffList();
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
  if (streamBanner) {
    const meta = STREAM_META[stream];
    if (meta) {
      streamBanner.className = `stream-banner stream-${stream}`;
      const title = currentLang === 'vi' ? meta.titleVi : meta.titleEn;
      const desc = currentLang === 'vi' ? meta.descVi : meta.descEn;
      streamBanner.innerHTML = `
        <span class="stream-banner-icon" aria-hidden="true">${meta.icon}</span>
        <div class="stream-banner-content">
          <strong class="stream-banner-title">${title}</strong>
          <span class="stream-banner-desc">${desc}</span>
        </div>
      `;
    }
  }

  streamChipsContainer.dataset.stream = stream;
  streamChipsContainer.replaceChildren();
  const items = CANONICAL_CATALOG.filter((item) => item.stream === stream);

  for (const item of items) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'example-chip';
    button.dataset.itemId = item.id;
    button.setAttribute('aria-controls', 'description');

    const labelSpan = document.createElement('span');
    labelSpan.className = 'chip-label';
    labelSpan.textContent = currentLang === 'vi' ? item.chipVi : item.chipEn;

    const tagSpan = document.createElement('span');
    tagSpan.className = 'chip-tag';
    tagSpan.textContent = currentLang === 'vi' ? (item.tagVi || '') : (item.tagEn || '');

    button.append(labelSpan, tagSpan);

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
    const stream = tab.dataset.stream;
    const count = CANONICAL_CATALOG.filter((item) => item.stream === stream).length;
    const countEl = tab.querySelector('.stream-tab-count');
    if (countEl) {
      countEl.textContent = String(count);
    }
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

function setInputMode(mode) {
  const form = document.querySelector('#recognize-form');
  if (form) form.dataset.activeMode = mode;
  const modeTabs = document.querySelectorAll('.mode-tab');
  for (const t of modeTabs) {
    const isCurrent = t.dataset.mode === mode;
    t.classList.toggle('active', isCurrent);
    t.setAttribute('aria-selected', String(isCurrent));
  }
}

function setupModeSwitcher() {
  const modeTabs = document.querySelectorAll('.mode-tab');
  for (const tab of modeTabs) {
    tab.addEventListener('click', () => {
      setInputMode(tab.dataset.mode);
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

async function compressImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || (typeof file.type === 'string' && !file.type.startsWith('image/'))) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(
      currentLang === 'vi' ? 'Không thể đọc tệp ảnh.' : 'Could not read that photo file.'
    ));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error(
        currentLang === 'vi' ? 'Không thể giải mã hình ảnh.' : 'Could not decode image.'
      ));
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;
        const maxDim = 1200;

        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        const comma = dataUrl.indexOf(',');
        if (comma < 0) {
          reject(new Error(currentLang === 'vi' ? 'Lỗi nén ảnh.' : 'Compression failed.'));
          return;
        }
        const base64 = dataUrl.slice(comma + 1);
        const approxBytes = Math.round((base64.length * 3) / 4);

        resolve({
          mimeType: 'image/jpeg',
          base64,
          dataUrl,
          width,
          height,
          sizeBytes: approxBytes,
        });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function readImage(file) {
  try {
    const compressed = await compressImage(file);
    if (compressed && compressed.base64) {
      return { mimeType: 'image/jpeg', base64: compressed.base64 };
    }
  } catch (err) {
    console.warn('Canvas compression fallback to raw read:', err);
  }

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
        resolve({ mimeType: file.type || 'image/jpeg', base64: result.slice(comma + 1) });
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
  if (imagePreviewMeta) imagePreviewMeta.textContent = '';
  imagePreview.hidden = true;
}

function showImagePreview(file) {
  clearImagePreview();
  selectedImage = file;
  setInputMode('photo');
  imagePreviewUrl = URL.createObjectURL(file);
  imagePreviewImage.src = imagePreviewUrl;
  imagePreviewImage.alt = `Selected photo: ${file.name}`;
  imagePreviewName.textContent = file.name;
  if (imagePreviewMeta) {
    const origSizeKb = Math.round(file.size / 1024);
    imagePreviewMeta.textContent = currentLang === 'vi'
      ? `Gốc: ${origSizeKb} KB · Đang tối ưu…`
      : `Original: ${origSizeKb} KB · Optimizing…`;
  }
  imagePreview.hidden = false;

  compressImage(file).then((res) => {
    if (res && selectedImage === file && imagePreviewMeta) {
      const compSizeKb = Math.round(res.sizeBytes / 1024);
      imagePreviewMeta.textContent = currentLang === 'vi'
        ? `Đã tối ưu: ~${compSizeKb} KB (${res.width}×${res.height})`
        : `Optimized: ~${compSizeKb} KB (${res.width}×${res.height})`;
    }
  }).catch(() => {});
}

for (const input of [imageInput, cameraInput]) {
  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (file) showImagePreview(file);
  });
}

takePhotoButton.addEventListener('click', () => cameraInput.click());
choosePhotoButton.addEventListener('click', () => imageInput.click());

if (retakeImageButton) {
  retakeImageButton.addEventListener('click', () => {
    choosePhotoButton.click();
  });
}

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
        currentLang === 'vi'
          ? 'Chưa nhận diện được độ chắc chắn cao. Vui lòng chọn từ danh mục chuẩn:'
          : 'I could not confidently identify that item. Choose a catalog item instead:',
        version
      );
      return;
    }
    setCandidate(proposed);
    recognitionFeedback.hidden = true;
  } catch (error) {
    if (version === requestVersion) {
      await offerManualSelection(
        currentLang === 'vi'
          ? 'Nhận diện thất bại. Chọn từ danh mục chuẩn:'
          : 'Recognition failed. Choose a catalog item instead:',
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
  setInputMode('text');
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

  // Official Bag Color Badge & Decree 45 Compliance Notice
  renderBagBadgeAndNotice(contentNode, cat, canonicalItemId);

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

// Stream and Bag Color Badges Helper
function getStreamForCategory(category, canonicalItemId) {
  if (category === 'Food waste') return 'food';
  if (category === 'Reusable and recyclable solid waste') return 'recyclables';
  if (category === 'Household hazardous waste') return 'hazardous';
  if (category === 'Bulky waste') return 'bulky';
  if (category === 'Other domestic solid waste') return 'other';
  const item = findCatalogItem(canonicalItemId);
  if (item?.stream) return item.stream;
  return 'other';
}

function renderBagBadgeAndNotice(container, category, canonicalItemId) {
  const streamKey = getStreamForCategory(category, canonicalItemId);
  const info = BAG_BADGE_INFO[streamKey] || BAG_BADGE_INFO.other;

  const badge = document.createElement('div');
  badge.className = `official-bag-badge ${info.badgeClass}`;

  const icon = document.createElement('span');
  icon.className = 'bag-badge-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.innerHTML = info.icon;

  const content = document.createElement('div');
  content.className = 'bag-badge-content';

  const label = document.createElement('span');
  label.className = 'bag-badge-label';
  label.textContent = t('bagStandardLabel');

  const title = document.createElement('strong');
  title.className = 'bag-badge-title';
  title.textContent = t(info.titleKey);

  const desc = document.createElement('span');
  desc.className = 'bag-badge-desc';
  desc.textContent = currentLang === 'vi' ? info.subVi : info.subEn;

  content.append(label, title, desc);
  badge.append(icon, content);
  container.append(badge);

  const compliance = document.createElement('aside');
  compliance.className = 'compliance-notice';
  compliance.setAttribute('aria-label', t('decreeNoticeHeading'));

  const compIcon = document.createElement('span');
  compIcon.className = 'compliance-icon';
  compIcon.setAttribute('aria-hidden', 'true');
  compIcon.innerHTML = HEROICONS.scale;

  const compContent = document.createElement('div');
  compContent.className = 'compliance-content';

  const compTitle = document.createElement('strong');
  compTitle.className = 'compliance-title';
  compTitle.textContent = t('decreeNoticeHeading');

  const compCopy = document.createElement('p');
  compCopy.className = 'compliance-copy';
  compCopy.textContent = t('decreeNoticeText');

  compContent.append(compTitle, compCopy);
  compliance.append(compIcon, compContent);
  container.append(compliance);
}

// Voice Search (Web Speech API)
function setupVoiceSearch() {
  if (!voiceSearchBtn) return;

  if (!SpeechRecognition) {
    voiceSearchBtn.addEventListener('click', () => {
      showVoiceStatus(t('voiceNotSupported'), false);
    });
    return;
  }

  voiceSearchBtn.addEventListener('click', () => {
    if (isListening) {
      stopVoiceSearch();
    } else {
      startVoiceSearch();
    }
  });
}

function showVoiceStatus(message, isRecording = false) {
  if (!voiceStatus) return;
  voiceStatus.textContent = message;
  voiceStatus.classList.toggle('listening', isRecording);
  voiceStatus.hidden = false;
  if (!isRecording) {
    setTimeout(() => {
      if (!isListening && voiceStatus) voiceStatus.hidden = true;
    }, 4500);
  }
}

function startVoiceSearch() {
  if (!SpeechRecognition) return;
  try {
    recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = currentLang === 'vi' ? 'vi-VN' : 'en-US';
    recognitionInstance.interimResults = true;
    recognitionInstance.continuous = false;

    recognitionInstance.onstart = () => {
      isListening = true;
      voiceSearchBtn.classList.add('listening');
      showVoiceStatus(t('voiceListening'), true);
    };

    recognitionInstance.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (transcript.trim()) {
        descriptionInput.value = transcript.trim();
      }
    };

    recognitionInstance.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      isListening = false;
      voiceSearchBtn.classList.remove('listening');
      if (event.error === 'not-allowed') {
        showVoiceStatus(t('voicePermissionDenied'), false);
      } else if (event.error !== 'no-speech') {
        showVoiceStatus(event.error, false);
      } else {
        showVoiceStatus(t('voiceNoSpeech'), false);
      }
    };

    recognitionInstance.onend = () => {
      isListening = false;
      voiceSearchBtn.classList.remove('listening');
      if (descriptionInput.value.trim()) {
        showVoiceStatus(t('voiceSuccess'), false);
      } else {
        if (voiceStatus) voiceStatus.hidden = true;
      }
    };

    recognitionInstance.start();
  } catch (err) {
    console.warn('Speech start failed:', err);
    isListening = false;
    if (voiceSearchBtn) voiceSearchBtn.classList.remove('listening');
  }
}

function stopVoiceSearch() {
  if (recognitionInstance) {
    try {
      recognitionInstance.stop();
    } catch {}
  }
  isListening = false;
  if (voiceSearchBtn) voiceSearchBtn.classList.remove('listening');
}

// Waste Sorting Quiz Logic
function openQuizModal() {
  quizCurrentIndex = 0;
  quizScore = 0;
  quizUserAnswers = [];
  renderQuizQuestion();
  if (quizModal) quizModal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeQuizModal() {
  if (!quizModal) return;
  quizModal.hidden = true;
  document.body.style.overflow = '';
}

function renderQuizQuestion() {
  if (!quizBody) return;
  quizBody.replaceChildren();

  if (quizCurrentIndex >= QUIZ_QUESTIONS.length) {
    renderQuizScoreScreen();
    return;
  }

  const q = QUIZ_QUESTIONS[quizCurrentIndex];
  const total = QUIZ_QUESTIONS.length;
  const currentNum = quizCurrentIndex + 1;

  const progBar = document.createElement('div');
  progBar.className = 'quiz-progress-bar';
  const progFill = document.createElement('div');
  progFill.className = 'quiz-progress-fill';
  progFill.style.width = `${((currentNum - 1) / total) * 100}%`;
  progBar.append(progFill);

  const counter = document.createElement('div');
  counter.className = 'quiz-counter';
  counter.textContent = t('quizQuestionCounter')
    .replace('{current}', String(currentNum))
    .replace('{total}', String(total));

  const qText = document.createElement('h3');
  qText.className = 'quiz-question-text';
  qText.textContent = currentLang === 'vi' ? q.questionVi : q.questionEn;

  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'quiz-options';
  const letters = ['A', 'B', 'C', 'D'];
  const options = currentLang === 'vi' ? q.optionsVi : q.optionsEn;

  const buttons = [];
  options.forEach((optText, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'quiz-option-btn';

    const letterSpan = document.createElement('span');
    letterSpan.className = 'quiz-option-letter';
    letterSpan.textContent = letters[idx];

    const labelSpan = document.createElement('span');
    labelSpan.textContent = optText;

    btn.append(letterSpan, labelSpan);

    btn.addEventListener('click', () => {
      handleAnswerSelected(idx, buttons, q);
    });

    buttons.push(btn);
    optionsContainer.append(btn);
  });

  quizBody.append(progBar, counter, qText, optionsContainer);
}

function handleAnswerSelected(selectedIdx, buttons, question) {
  buttons.forEach((b) => (b.disabled = true));
  const isCorrect = selectedIdx === question.correctIndex;
  if (isCorrect) quizScore++;
  quizUserAnswers.push({ questionId: question.id, selectedIdx, isCorrect });

  buttons.forEach((b, idx) => {
    if (idx === question.correctIndex) {
      b.classList.add('correct');
    } else if (idx === selectedIdx && !isCorrect) {
      b.classList.add('incorrect');
    }
  });

  const feedback = document.createElement('div');
  feedback.className = `quiz-feedback ${isCorrect ? '' : 'is-wrong'}`;

  const fbTitle = document.createElement('div');
  fbTitle.className = 'quiz-feedback-title';
  const fbIcon = isCorrect ? HEROICONS.checkCircle : HEROICONS.xCircle;
  const fbText = isCorrect
    ? (currentLang === 'vi' ? 'Chính xác!' : 'Correct!')
    : (currentLang === 'vi' ? 'Chưa chính xác!' : 'Incorrect!');
  fbTitle.innerHTML = `${fbIcon} <span>${fbText}</span>`;

  const fbCopy = document.createElement('p');
  fbCopy.className = 'quiz-feedback-copy';
  fbCopy.textContent = currentLang === 'vi' ? question.feedbackVi : question.feedbackEn;

  feedback.append(fbTitle, fbCopy);

  const navActions = document.createElement('div');
  navActions.className = 'quiz-nav-actions';
  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'button button-primary';
  const isLast = quizCurrentIndex === QUIZ_QUESTIONS.length - 1;
  nextBtn.textContent = isLast ? t('quizFinishBtn') : t('quizNextBtn');

  nextBtn.addEventListener('click', () => {
    quizCurrentIndex++;
    renderQuizQuestion();
  });

  navActions.append(nextBtn);
  quizBody.append(feedback, navActions);
}

function renderQuizScoreScreen() {
  const view = document.createElement('div');
  view.className = 'quiz-score-view';

  const trophy = document.createElement('div');
  trophy.className = 'quiz-trophy';
  trophy.innerHTML = quizScore === 5 ? HEROICONS.trophy : quizScore >= 3 ? HEROICONS.sparkles : HEROICONS.academicCap;

  const scoreNum = document.createElement('h3');
  scoreNum.className = 'quiz-score-number';
  scoreNum.textContent = `${quizScore} / ${QUIZ_QUESTIONS.length}`;

  const scoreTitle = document.createElement('p');
  scoreTitle.className = 'quiz-score-title';
  if (quizScore === 5) {
    scoreTitle.textContent = t('quizScoreMaster');
  } else if (quizScore >= 3) {
    scoreTitle.textContent = t('quizScoreGood');
  } else {
    scoreTitle.textContent = t('quizScorePractice');
  }

  const scoreCopy = document.createElement('p');
  scoreCopy.className = 'quiz-score-copy';
  scoreCopy.textContent = currentLang === 'vi'
    ? 'Căn cứ theo Nghị định 45/2022/NĐ-CP, việc phân loại rác đúng nguồn là nghĩa vụ pháp lý của mọi hộ gia đình tại Hà Nội và TP.HCM.'
    : 'Under Decree 45/2022/NĐ-CP, source-segregation of domestic waste is legally binding for households in Hanoi and Ho Chi Minh City.';

  const actions = document.createElement('div');
  actions.className = 'quiz-score-actions';

  const shareBtn = document.createElement('button');
  shareBtn.type = 'button';
  shareBtn.className = 'button button-primary';
  shareBtn.textContent = t('quizShareBtn');
  shareBtn.addEventListener('click', async () => {
    const summaryText = currentLang === 'vi'
      ? `♻️ Tôi vừa đạt ${quizScore}/5 điểm Trắc nghiệm phân loại rác trên WhatBin! Hãy thử tài phân loại rác chuẩn Hà Nội & TP.HCM tại WhatBin!`
      : `♻️ I scored ${quizScore}/5 on WhatBin's Waste Sorting Quiz! Test your waste sorting skills under Hanoi & HCMC regulations!`;
    try {
      await navigator.clipboard.writeText(summaryText);
      shareBtn.textContent = t('quizCopied');
      setTimeout(() => {
        shareBtn.textContent = t('quizShareBtn');
      }, 3000);
    } catch {
      alert(summaryText);
    }
  });

  const retakeBtn = document.createElement('button');
  retakeBtn.type = 'button';
  retakeBtn.className = 'button button-secondary';
  retakeBtn.textContent = t('quizRetakeBtn');
  retakeBtn.addEventListener('click', () => {
    quizCurrentIndex = 0;
    quizScore = 0;
    quizUserAnswers = [];
    renderQuizQuestion();
  });

  actions.append(shareBtn, retakeBtn);
  view.append(trophy, scoreNum, scoreTitle, scoreCopy, actions);
  quizBody.append(view);
}

// Drop-off Directory Logic
function openDropoffModal() {
  if (!dropoffModal) return;
  dropoffModal.hidden = false;
  document.body.style.overflow = 'hidden';
  renderDropoffList();
}

function closeDropoffModal() {
  if (!dropoffModal) return;
  dropoffModal.hidden = true;
  document.body.style.overflow = '';
}

function renderDropoffList() {
  if (!dropoffList) return;
  dropoffList.replaceChildren();

  const filtered = DROPOFF_HUBS.filter((hub) => {
    const matchesCity = dropoffActiveCity === 'all' || hub.city === 'all' || hub.city === dropoffActiveCity;
    const matchesStream = dropoffActiveStream === 'all' || hub.stream === dropoffActiveStream;
    return matchesCity && matchesStream;
  });

  if (!filtered.length) {
    const empty = document.createElement('p');
    empty.className = 'muted-copy';
    empty.textContent = currentLang === 'vi'
      ? 'Không tìm thấy điểm thu gom phù hợp với bộ lọc.'
      : 'No drop-off hubs matched the selected filters.';
    dropoffList.append(empty);
    return;
  }

  for (const hub of filtered) {
    const card = document.createElement('article');
    card.className = 'dropoff-card';

    const header = document.createElement('div');
    header.className = 'dropoff-card-header';

    const title = document.createElement('h3');
    title.className = 'dropoff-card-title';
    title.textContent = currentLang === 'vi' ? hub.titleVi : hub.titleEn;

    const badge = document.createElement('span');
    badge.className = 'dropoff-badge';
    badge.textContent = currentLang === 'vi' ? hub.badgeVi : hub.badgeEn;

    header.append(title, badge);

    const address = document.createElement('p');
    address.className = 'dropoff-address';
    address.innerHTML = `<span class="hub-pin">${HEROICONS.mapPin}</span> <span>${currentLang === 'vi' ? hub.addressVi : hub.addressEn}</span>`;

    const notes = document.createElement('p');
    notes.className = 'dropoff-notes';
    notes.textContent = currentLang === 'vi' ? hub.notesVi : hub.notesEn;

    card.append(header, address, notes);
    dropoffList.append(card);
  }
}

function setupDropoffFilters() {
  if (dropoffCityFilters) {
    dropoffCityFilters.querySelectorAll('.filter-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        dropoffCityFilters.querySelectorAll('.filter-chip').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        dropoffActiveCity = btn.dataset.city;
        renderDropoffList();
      });
    });
  }

  if (dropoffStreamFilters) {
    dropoffStreamFilters.querySelectorAll('.filter-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        dropoffStreamFilters.querySelectorAll('.filter-chip').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        dropoffActiveStream = btn.dataset.stream;
        renderDropoffList();
      });
    });
  }
}

// Quick Nav, Modals & Print Listeners
openQuizBtn?.addEventListener('click', openQuizModal);
footerQuizBtn?.addEventListener('click', openQuizModal);
quizCloseBtn?.addEventListener('click', closeQuizModal);
quizBackdrop?.addEventListener('click', closeQuizModal);

openDropoffBtn?.addEventListener('click', openDropoffModal);
footerDropoffBtn?.addEventListener('click', openDropoffModal);
dropoffCloseBtn?.addEventListener('click', closeDropoffModal);
dropoffBackdrop?.addEventListener('click', closeDropoffModal);

printGuideBtn?.addEventListener('click', () => window.print());
footerPrintBtn?.addEventListener('click', () => window.print());

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeQuizModal();
    closeDropoffModal();
  }
});

// Progressive Web App Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('SW registration failed:', err);
    });
  });
}

// Initial setup
setupStreamTabs();
setupModeSwitcher();
setupVoiceSearch();
setupDropoffFilters();
setLanguage(currentLang);
