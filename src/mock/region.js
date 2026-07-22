const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// ====== 省 ======
const provinces = [
  { value: '110000', label: '北京市' },
  { value: '310000', label: '上海市' },
  { value: '440000', label: '广东省' },
  { value: '320000', label: '江苏省' },
  { value: '330000', label: '浙江省' },
  { value: '510000', label: '四川省' },
  { value: '350000', label: '福建省' },
  { value: '420000', label: '湖北省' },
  { value: '430000', label: '湖南省' },
  { value: '500000', label: '重庆市' },
]

// ====== 市 ======
const cities = {
  '110000': [{ value: '110100', label: '北京市' }],
  '310000': [{ value: '310100', label: '上海市' }],
  '440000': [
    { value: '440100', label: '广州市' },
    { value: '440300', label: '深圳市' },
    { value: '440400', label: '珠海市' },
    { value: '440600', label: '佛山市' },
    { value: '441900', label: '东莞市' },
  ],
  '320000': [
    { value: '320100', label: '南京市' },
    { value: '320500', label: '苏州市' },
    { value: '320200', label: '无锡市' },
    { value: '320600', label: '南通市' },
  ],
  '330000': [
    { value: '330100', label: '杭州市' },
    { value: '330200', label: '宁波市' },
    { value: '330300', label: '温州市' },
  ],
  '510000': [
    { value: '510100', label: '成都市' },
    { value: '510700', label: '绵阳市' },
    { value: '511500', label: '宜宾市' },
  ],
  '350000': [
    { value: '350100', label: '福州市' },
    { value: '350200', label: '厦门市' },
    { value: '350500', label: '泉州市' },
  ],
  '420000': [
    { value: '420100', label: '武汉市' },
    { value: '420500', label: '宜昌市' },
    { value: '420600', label: '襄阳市' },
  ],
  '430000': [
    { value: '430100', label: '长沙市' },
    { value: '430200', label: '株洲市' },
    { value: '430400', label: '衡阳市' },
  ],
  '500000': [{ value: '500100', label: '重庆市' }],
}

// ====== 区/县 ======
const districts = {
  '110100': [
    { value: '110101', label: '东城区' },
    { value: '110102', label: '西城区' },
    { value: '110105', label: '朝阳区' },
    { value: '110106', label: '丰台区' },
    { value: '110108', label: '海淀区' },
    { value: '110109', label: '门头沟区' },
  ],
  '310100': [
    { value: '310101', label: '黄浦区' },
    { value: '310104', label: '徐汇区' },
    { value: '310105', label: '长宁区' },
    { value: '310106', label: '静安区' },
    { value: '310107', label: '普陀区' },
    { value: '310109', label: '虹口区' },
  ],
  '440100': [
    { value: '440103', label: '荔湾区' },
    { value: '440104', label: '越秀区' },
    { value: '440105', label: '海珠区' },
    { value: '440106', label: '天河区' },
    { value: '440111', label: '白云区' },
    { value: '440112', label: '黄埔区' },
  ],
  '440300': [
    { value: '440303', label: '罗湖区' },
    { value: '440304', label: '福田区' },
    { value: '440305', label: '南山区' },
    { value: '440306', label: '宝安区' },
    { value: '440307', label: '龙岗区' },
    { value: '440308', label: '盐田区' },
  ],
  '440400': [
    { value: '440402', label: '香洲区' },
    { value: '440403', label: '斗门区' },
    { value: '440404', label: '金湾区' },
  ],
  '440600': [
    { value: '440604', label: '禅城区' },
    { value: '440605', label: '南海区' },
    { value: '440606', label: '顺德区' },
  ],
  '320100': [
    { value: '320102', label: '玄武区' },
    { value: '320104', label: '秦淮区' },
    { value: '320105', label: '建邺区' },
    { value: '320106', label: '鼓楼区' },
    { value: '320111', label: '浦口区' },
  ],
  '320500': [
    { value: '320505', label: '虎丘区' },
    { value: '320506', label: '吴中区' },
    { value: '320507', label: '相城区' },
    { value: '320508', label: '姑苏区' },
    { value: '320509', label: '吴江区' },
  ],
  '330100': [
    { value: '330102', label: '上城区' },
    { value: '330103', label: '下城区' },
    { value: '330106', label: '西湖区' },
    { value: '330108', label: '滨江区' },
    { value: '330109', label: '萧山区' },
  ],
  '510100': [
    { value: '510104', label: '锦江区' },
    { value: '510105', label: '青羊区' },
    { value: '510106', label: '金牛区' },
    { value: '510107', label: '武侯区' },
    { value: '510108', label: '成华区' },
  ],
  '350100': [
    { value: '350102', label: '鼓楼区' },
    { value: '350103', label: '台江区' },
    { value: '350104', label: '仓山区' },
    { value: '350105', label: '马尾区' },
  ],
  '350200': [
    { value: '350203', label: '思明区' },
    { value: '350205', label: '海沧区' },
    { value: '350206', label: '湖里区' },
    { value: '350211', label: '集美区' },
  ],
  '420100': [
    { value: '420102', label: '江岸区' },
    { value: '420103', label: '江汉区' },
    { value: '420104', label: '硚口区' },
    { value: '420105', label: '汉阳区' },
    { value: '420106', label: '武昌区' },
  ],
  '430100': [
    { value: '430102', label: '芙蓉区' },
    { value: '430103', label: '天心区' },
    { value: '430104', label: '岳麓区' },
    { value: '430105', label: '开福区' },
    { value: '430111', label: '雨花区' },
  ],
  '500100': [
    { value: '500101', label: '万州区' },
    { value: '500102', label: '涪陵区' },
    { value: '500103', label: '渝中区' },
    { value: '500104', label: '大渡口区' },
    { value: '500105', label: '江北区' },
    { value: '500106', label: '沙坪坝区' },
    { value: '500107', label: '九龙坡区' },
    { value: '500108', label: '南岸区' },
  ],
}

// ====== 街道/镇 ======
const towns = {
  '110101': [
    { value: '110101001', label: '东华门街道' },
    { value: '110101002', label: '景山街道' },
    { value: '110101003', label: '交道口街道' },
    { value: '110101004', label: '安定门街道' },
  ],
  '110102': [
    { value: '110102001', label: '西长安街街道' },
    { value: '110102002', label: '新街口街道' },
    { value: '110102003', label: '月坛街道' },
  ],
  '110105': [
    { value: '110105001', label: '建国门外街道' },
    { value: '110105002', label: '朝阳门外街道' },
    { value: '110105003', label: '呼家楼街道' },
    { value: '110105004', label: '三里屯街道' },
  ],
  '440106': [
    { value: '440106001', label: '天河南街道' },
    { value: '440106002', label: '林和街道' },
    { value: '440106003', label: '石牌街道' },
    { value: '440106004', label: '五山街道' },
  ],
  '440305': [
    { value: '440305001', label: '南头街道' },
    { value: '440305002', label: '南山街道' },
    { value: '440305003', label: '蛇口街道' },
    { value: '440305004', label: '招商街道' },
  ],
  '440304': [
    { value: '440304001', label: '园岭街道' },
    { value: '440304002', label: '南园街道' },
    { value: '440304003', label: '华富街道' },
  ],
}

// ====== Mock API ======

export async function fetchProvinces() {
  await delay(400)
  return provinces
}

export async function fetchCities(provinceValue) {
  await delay(400)
  return cities[provinceValue] || []
}

export async function fetchDistricts(cityValue) {
  await delay(400)
  return districts[cityValue] || []
}

export async function fetchTowns(districtValue) {
  await delay(600)
  return towns[districtValue] || []
}

// 判断节点是否有下级数据（用于设置 leaf 属性）
export function hasCities(provinceValue) {
  return provinceValue in cities
}

export function hasDistricts(cityValue) {
  return cityValue in districts
}

export function hasTowns(districtValue) {
  return districtValue in towns
}
