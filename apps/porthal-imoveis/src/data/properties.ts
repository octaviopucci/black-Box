export interface Property {
  id: string
  title: string
  address: string
  price: string
  bedrooms: string
  garages: string
  bedroomCount: number | null
  garageCount: number | null
  area: string
  image: string
  href: string
  description: string
}

export interface Highlight {
  title: string
  description: string
  image: string
  href: string
}

export const properties: Property[] = [
  {
    "id": "f8ff65af-9d9a-45c9-9fc0-0324ecb7ccfa",
    "title": "Área para Hotel Fazenda/Camping à Venda em Rural Capão Bonito-SP",
    "address": "Rural - Capão Bonito/SP",
    "price": "Consulte",
    "bedrooms": "",
    "garages": "",
    "bedroomCount": null,
    "garageCount": null,
    "area": "24,20 ha (Área total)",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/b14f6c5f-da7c-495f-818d-0371e3c500ec1774542835lOUX.jpg",
    "href": "https://porthalimoveis.com.br/imovel/area-para-hotel-fazenda-camping-a-venda-em-rural-capao-bonito-sp/340",
    "description": "Área total de 10 alqueires ou 242.000,00m2  Infraestrutura pronta de um Hotel Fazenda.  AREAS CONSTRUÍDAS: área total edificada de 6.900 m2, sendo 3.900 m2 de área pronta e 3.000 m2 sem acabamento ÁREA EXTERNA ·Ruas calç"
  },
  {
    "id": "c5912d08-acab-46ad-946f-084941a8cae8",
    "title": "Casa Alto Padrão",
    "address": "Vila Santa Isabel - Capão Bonito/SP",
    "price": "R$1.100.000,00",
    "bedrooms": "4 Dormitórios, sendo 2 suítes",
    "garages": "4 Garagens",
    "bedroomCount": 4,
    "garageCount": 4,
    "area": "1.200,00 m² (Área total)",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/3f57904d-b068-473e-b43a-63c4976dc6241768827532hf7K.jpg",
    "href": "https://porthalimoveis.com.br/imovel/adquira-esta-magnifica-casa-de-alto-padrao-no-bairro-vila-santa-isabel-em-capao-bonito-sp-com-4-dormitorios/1018",
    "description": "Adquira esta magnífica casa de alto padrão no bairro Vila Santa Isabel em Capão Bonito-SP. Com 4 Dormitórios, sendo 2 suítes e 2 Banheiro, escritório. garagem para 4 carros e amplo espaço gramado, esta residência esbanja"
  },
  {
    "id": "1d25e383-6cab-451e-bc7f-3ba887a653f8",
    "title": "Sobrado Alto Padrão",
    "address": "Vila Nova Capão Bonito - Capão Bonito/SP",
    "price": "R$850.000,00",
    "bedrooms": "3 Dormitórios, sendo 1 suíte",
    "garages": "3 Garagens",
    "bedroomCount": 3,
    "garageCount": 3,
    "area": "668,00 m² (Área total)",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/0f4b0ebc-ba34-44fb-ab29-6b32896cd6351764709679i2JO.jpg",
    "href": "https://porthalimoveis.com.br/imovel/sobrado-a-venda-no-bairro-vila-nova-capao-bonito-capao-bonito-sp/994",
    "description": "🏠 Procurando um sobrado alto padrão para chamar de seu? Este sobrado de tirar o fôlego na Vila Nova Capão Bonito é tudo o que você sempre sonhou!  Com 3 dormitórios, sendo 1 suíte, e 3 banheiros, este sobrado é o espaço "
  },
  {
    "id": "69556a46-9e20-41e3-849f-ae41009b44e9",
    "title": "Sítio divisa com Rio das Almas. Casa sede 115,00m² com 3 dorm…",
    "address": "Rural - Capão Bonito/SP",
    "price": "R$550.000,00",
    "bedrooms": "3 Dormitórios",
    "garages": "",
    "bedroomCount": 3,
    "garageCount": null,
    "area": "3 hectares",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/d9e5ad0c-c0f2-403c-a7e6-14e8cc2ee2e116855648659l1P.jpg",
    "href": "https://porthalimoveis.com.br/imovel/sitio-com-divisa-em-rio-piscoso-capao-bonitosp/388",
    "description": "Casa sede 115,00m² com 3 dormitórios, sala, copa/cozinha, despensa, banheiro, frente avarandada e Internet via satélite. Poço Semi Artesiano com 88 mts de profundidade Galpão 40,00m². Pequeno galpão com 35,00m² ao lado d"
  },
  {
    "id": "12644d63-098b-44ba-ac20-4a1a5eee1b29",
    "title": "Casa Padrão",
    "address": "Vila Nova Capão Bonito - Capão Bonito/SP",
    "price": "R$550.000,00",
    "bedrooms": "2 Dormitórios, sendo 2 suítes",
    "garages": "1 Garagem",
    "bedroomCount": 2,
    "garageCount": 1,
    "area": "180,00 m² (Área total)",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/cde13956-da31-489f-b694-6cefe0692c301764706204q4YG.jpg",
    "href": "https://porthalimoveis.com.br/imovel/casa-a-venda-no-bairro-vila-nova-capao-bonito-capao-bonito-sp/1013",
    "description": "Excelente oportunidade de adquirir uma residência impecável no bairro Vila Nova Capão Bonito, em Capão Bonito-SP. Este imóvel charmoso e moderno possui 2 dormitórios, todos suítes, e mais 1 banheiro para maior comodidade"
  },
  {
    "id": "f418d4ac-a27d-424d-a9ed-c1b04c9b8137",
    "title": "Casa Padrão pronta para financiamento ...",
    "address": "Jardim Emilia - Ribeirão Grande/SP",
    "price": "R$350.000,00",
    "bedrooms": "3 Dormitórios",
    "garages": "2 Garagens",
    "bedroomCount": 3,
    "garageCount": 2,
    "area": "241,20 m² (Área total)",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/d95b449f-276d-4479-9e4b-1737d54d6e401770398354KKg0.jpg",
    "href": "https://porthalimoveis.com.br/imovel/casa-a-venda-no-bairro-jardim-emilia-aceita-financiamento-onde-uma-oportunidade-unica-lhe-aguarda/906",
    "description": "Aceita financiamento: Bem-vindo(a) ao cenário encantador do bairro Jardim Emília, em Ribeirão Grande-SP, onde uma oportunidade única de compra de casa aguarda por você. Apresentamos uma belíssima residência com uma ofert"
  },
  {
    "id": "2514c5e4-d829-437f-8fd8-7c231a9fc8ae",
    "title": "Sítio",
    "address": "Frente para Rodovia SP-250 ... - Capão Bonito/SP, Rural",
    "price": "Consulte",
    "bedrooms": "3 Dormitórios",
    "garages": "1 Garagem",
    "bedroomCount": 3,
    "garageCount": 1,
    "area": "",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/da9ab693-9862-4ea1-a806-52beb383b1231764955163OJB8.jpg",
    "href": "https://porthalimoveis.com.br/imovel/sitio-a-venda-em-area-rural-de-capao-bonito-sp-excelente-oportunidade-de-adquirir-um-sitio-rico-em-agua-proprias/973",
    "description": "Excelente oportunidade de adquirir um sítio localizado em área rural de Capão Bonito-SP. Com uma área total de 14,34 hectares, contendo uma área construída total de 650m² com uma bela represa e vários açudes com peixes, "
  },
  {
    "id": "7b3c5362-a719-444e-93c6-14be37ebd61e",
    "title": "Sobrado Alto Padrão",
    "address": "Bela Vista - Capão Bonito/SP",
    "price": "R$600.000,00",
    "bedrooms": "3 Dormitórios, sendo 1 suíte",
    "garages": "3 Garagens",
    "bedroomCount": 3,
    "garageCount": 3,
    "area": "300,00 m² (Área total)",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/88a6a5f3-830f-46a0-8aa7-37cb2c6ad80f1749062078nO5j.jpg",
    "href": "https://porthalimoveis.com.br/imovel/sobrado-a-venda-no-bairro-bela-vista-capao-bonitosp-procurando-um-sobrado-alto-padrao-para-chamar-de-seu/978",
    "description": "Procurando um sobrado alto padrão para chamar de seu? Este imóvel no bairro Bela Vista  em Capão Bonito-SP pode ser exatamente o que você está procurando!  Com 3 Dormitórios, sendo 1 suíte, e 4 Banheiros, garagem para tr"
  },
  {
    "id": "ccb6d235-c5e2-4df4-bbfa-a18871b7bf6a",
    "title": "Apartamento à venda no bairro Terras do Embiruçu em Capão Bon…",
    "address": "Terras do Embiruçu - Capão Bonito/SP",
    "price": "R$330.000,00",
    "bedrooms": "3 Dormitórios",
    "garages": "1 Garagem",
    "bedroomCount": 3,
    "garageCount": 1,
    "area": "60,36 m²",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/1d532dae-6f38-4f4a-98c4-8bb7dc5dd6f91722536989oR9B.jpg",
    "href": "https://porthalimoveis.com.br/imovel/apartamento-com-3-dormitorios-e-1-banheiro-a-venda-no-bairro-terras-do-embirucu-capao-bonitosp/796",
    "description": "Apartamento à venda no bairro Terras do Embiruçu em Capão Bonito-SP, com 3 dormitórios e 1 banheiro. Essa excelente oportunidade conta com uma bela piscina para desfrutar momentos de lazer e relaxamento.  O condomínio of"
  },
  {
    "id": "5d7fb8ca-2398-49d3-b6b8-0cc6e9355cdd",
    "title": "Ponto Comercial Comércio",
    "address": "Centro - Capão Bonito/SP",
    "price": "Consulte",
    "bedrooms": "",
    "garages": "",
    "bedroomCount": null,
    "garageCount": null,
    "area": "235,00 m² (Área total)",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/cee1745f-c927-4e29-b9f1-346e54b96cd61727460480LNSk.jpg",
    "href": "https://porthalimoveis.com.br/imovel/ponto-comercial-a-venda-no-bairro-centro-capao-bonitosp/940",
    "description": "Excelente oportunidade de investimento! Está à procura de um ponto comercial amplo, bem localizado e pronto para receber o seu negócio? Esta é a sua chance!  Localizada no coração do Centro em Capão Bonito-SP, este ponto"
  },
  {
    "id": "ae24c906-dd69-492f-9376-075b9fc9e41e",
    "title": "Chácara toda cercada em alambrado casa sede com uma suíte, do…",
    "address": "Rural - Capão Bonito/SP",
    "price": "R$380.000,00",
    "bedrooms": "3 Dormitórios, sendo 1 suíte",
    "garages": "2 Garagens",
    "bedroomCount": 3,
    "garageCount": 2,
    "area": "",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/2b4a0d1b-b45b-44f6-8c88-16012d2014641727462913VvYy.jpg",
    "href": "https://porthalimoveis.com.br/imovel/chacara-a-venda-no-bairro-rural-capao-bonitosp/441",
    "description": "Em busca da chácara dos sonhos para relaxar nos fins de semana ou até mesmo morar? Essa é a oportunidade perfeita! Com 3 dormitórios, incluindo 1 suíte para garantir o conforto necessário, e 3 banheiros para evitar filas"
  },
  {
    "id": "595d13ea-556e-40ac-84d1-72036d266a5d",
    "title": "Casa Padrão",
    "address": "Centro - Buri/SP",
    "price": "R$650.000,00",
    "bedrooms": "2 Dormitórios, sendo 1 suíte",
    "garages": "1 Garagem",
    "bedroomCount": 2,
    "garageCount": 1,
    "area": "271,00 m² (Área total)",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/d4250b2c-f7c7-42d2-ae33-aa054305abfe1725057335rm2r.jpg",
    "href": "https://porthalimoveis.com.br/imovel/se-voce-esta-em-busca-de-uma-casa-espacosa-e-bem-localizada-esta-pode-ser-a-opcao-ideal-para-voce/947",
    "description": "Se você está em busca de uma casa espaçosa e bem localizada, esta pode ser a opção ideal para você. Localizada no coração do bairro Centro em Buri - SP, esta casa à venda conta com 2 dormitórios, sendo 1 suíte, e 1 banhe"
  },
  {
    "id": "e485a835-c2bc-499d-b653-edcd13b23f27",
    "title": "Casa Alto Padrão",
    "address": "Centro - Peruíbe/SP",
    "price": "R$750.000,00",
    "bedrooms": "3 Dormitórios, sendo 1 suíte",
    "garages": "1 Garagem",
    "bedroomCount": 3,
    "garageCount": 1,
    "area": "250,00 m² (Área total)",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/b62e4b2d-d816-4d24-9109-7215dbcaae741745445169vLH9.jpg",
    "href": "https://porthalimoveis.com.br/imovel/casa-a-venda-no-bairro-centro-peruibesp-ei-voce-que-esta-em-busca-da-casa-dos-sonhos-em-peruibe-sp/974",
    "description": "Ei, você que está em busca da casa dos sonhos em Peruíbe-SP; olha só essa belezura que acabou de chegar ao mercado! Uma casa de alto padrão, localizada no coração do bairro Centro, com 3 dormitórios amplos (sendo 1 suíte"
  },
  {
    "id": "76b38cd6-26c9-47fb-987c-067b49601469",
    "title": "Sítio",
    "address": "Rural - Guapiara/SP",
    "price": "R$900.000,00",
    "bedrooms": "3 Dormitórios, sendo 2 suítes",
    "garages": "2 Garagens",
    "bedroomCount": 3,
    "garageCount": 2,
    "area": "",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/0cec87b9-8437-429d-9b27-316de5b0ef3c1706112574sQQN.jpg",
    "href": "https://porthalimoveis.com.br/imovel/sitio-a-venda-no-bairro-rural-guapiarasp/912",
    "description": "Se você está em busca de um sítio à venda, com todas as comodidades que você precisa, não deixe de conhecer essa incrível oportunidade localizada no bairro Rural em Guapiara-SP.  Com três dormitórios, sendo duas suítes, "
  },
  {
    "id": "5204e038-7daa-4e25-86d0-fd31cc99ddc0",
    "title": "Casa Térrea",
    "address": "Jardim Alvorada - Capão Bonito/SP",
    "price": "R$420.000,00",
    "bedrooms": "4 Dormitórios, sendo 2 suítes",
    "garages": "2 Garagens",
    "bedroomCount": 4,
    "garageCount": 2,
    "area": "394,00 m² (Área total)",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/2e329a64-1913-41b9-9691-f87ebd4684571690316826Byme.jpg",
    "href": "https://porthalimoveis.com.br/imovel/casa-terrea-para-venda-em-jardim-alvorada-capao-bonito-sp/199",
    "description": "Quatro quartos sendo duas suítes, sala, cozinha, hall, dois banheiros, garagem coberta para dois carros, edícula com copa cozinha, lavanderia, banheiro, despensa e quintal com arvores frutíferas... Aceita permuta por imó"
  },
  {
    "id": "5178d5dd-02ff-4f9f-ba53-fbfae8b0dced",
    "title": "Sobrado Tríplex Auto Padrão ...",
    "address": "Centro - São Miguel Arcanjo/SP",
    "price": "R$1.200.000,00",
    "bedrooms": "4 Dormitórios, sendo 1 suíte",
    "garages": "3 Garagens",
    "bedroomCount": 4,
    "garageCount": 3,
    "area": "250,00 m² (Área total)",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/dff1564c-7641-43fc-ac03-d2816c831abe1685389380wuGr.jpg",
    "href": "https://porthalimoveis.com.br/imovel/sobrado-triplex-jardim-sao-carlos-sao-miguel-arcanjosp/442",
    "description": "Quatro dormitórios sendo uma suíte, sacadas, sala de visita, sala de estar com lareira, sala de jantar, copa/cozinha, cozinha externa, cozinha gourmet completa com churrasqueira e forno a lenha, jardim, piso garagem para"
  },
  {
    "id": "530d7e13-1b12-4ae8-acaa-fdc6ba84d0ec",
    "title": "Casa Alto Padrão com área construída de 271,00 m² em terreno …",
    "address": "Centro - Capão Bonito/SP",
    "price": "Consulte",
    "bedrooms": "3 Dormitórios, sendo 2 suítes",
    "garages": "3 Garagens",
    "bedroomCount": 3,
    "garageCount": 3,
    "area": "548,00 m² (Área total)",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/1b214a3a-ed09-4027-9328-e4625c1bdff11679341051U4gK.jpg",
    "href": "https://porthalimoveis.com.br/imovel/casa-a-venda-no-bairro-centro-capao-bonitosp/822",
    "description": "Com área construída de 271,00 m² em terreno de 548 m² contendo duas suítes, dois quartos, sala de estar, sala de jantar, cozinha, área gourmet, garagem, quintal e piscina ...  As informações estão sujeitas a alterações. "
  },
  {
    "id": "property-18",
    "title": "Chácara divisa com rio piscoso ...",
    "address": "Rural - Capão Bonito/SP",
    "price": "Consulte",
    "bedrooms": "2 Dormitórios, sendo 1 suíte",
    "garages": "",
    "bedroomCount": 2,
    "garageCount": null,
    "area": "",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/9cce4df9-b611-421e-b39f-519a6481770f1652212050ytWy.jpg",
    "href": "https://porthalimoveis.com.br/detalhes/chacara-chacara-a-venda-em-capao-bonito-sp/374",
    "description": "Sob consulta ..."
  },
  {
    "id": "property-19",
    "title": "Fazenda",
    "address": "Parque Intervales - Capão Bonito/SP",
    "price": "Consulte",
    "bedrooms": "3 Dormitórios, sendo 1 suíte",
    "garages": "2 Garagens",
    "bedroomCount": 3,
    "garageCount": 2,
    "area": "283,08 ha",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/fd17d3b3-6200-4f94-9306-fecc2b92ac441652212056A3lW.jpg",
    "href": "https://porthalimoveis.com.br/detalhes/fazenda-com-11697-alqueires-para-venda-em-parque-intervales-capao-bonito-sp/371",
    "description": "Com 700 pés de Ameixa Rubimel com 4 anos, 800 pés Rubi II com 2 anos, 800 pés de Fla com 2 anos, 800 pés de Fortune com 2 anos, 200 pés de Pitaia com 2 anos, 1.700 pés de Atemoia com 2 anos e 80 hectares de Eucalipto com"
  },
  {
    "id": "7abf370f-ae2e-4857-b809-cce59c3ef2d3",
    "title": "Chácara",
    "address": "Rural - Capão Bonito/SP",
    "price": "Consulte",
    "bedrooms": "2 Dormitórios",
    "garages": "3 Garagens",
    "bedroomCount": 2,
    "garageCount": 3,
    "area": "",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/7d2f7ae7-f217-4f0e-8ff5-acc2fba669761652212057O7O0.jpg",
    "href": "https://porthalimoveis.com.br/imovel/sitio-divisa-com-rio-piscoso-a-poucos-minutos-do-centro-da-cidade-capao-bonito-sp/363",
    "description": "Apenas a 12 km do centro da cidade pela Rodovia Duplicada, um excelente lugar para você a usufruir seus dias a beira rio e assim desfrutar uma boa pescaria ou um passeio de barco neste excelente rio não poluído, contendo"
  },
  {
    "id": "2514c5e4-d829-437f-8fd8-7c231a9fc8ae",
    "title": "Sítio excelente oportunidade de adquirir um sítio localizado …",
    "address": "Área Rural de Capão Bonito - Capão Bonito/SP",
    "price": "R$1.500.000,00",
    "bedrooms": "3 Dormitórios",
    "garages": "1 Garagem",
    "bedroomCount": 3,
    "garageCount": 1,
    "area": "",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/140aac64-8dfb-4963-9ad5-09b8f5c2da7817453549821jsa.jpg",
    "href": "https://porthalimoveis.com.br/imovel/sitio-a-venda-em-area-rural-de-capao-bonitosp-excelente-oportunidade-de-adquirir-um-sitio-rico-em-agua-proprias/973",
    "description": "Excelente oportunidade de adquirir um sítio localizado em  área rural de Capão Bonito-SP. Com uma área total de 14,34 hectares, contendo uma área construída total de 650m² com uma bela represa e vários açudes com peixes,"
  },
  {
    "id": "162a81c2-eab4-47e7-9753-0dc81a10f951",
    "title": "Chácara Bairro Ferreira dos Matos. Esta bela propriedade cont…",
    "address": "Ferreira dos Matos - Ribeirão Grande/SP",
    "price": "R$210.000,00",
    "bedrooms": "4 Dormitórios, sendo 1 suíte",
    "garages": "2 Garagens",
    "bedroomCount": 4,
    "garageCount": 2,
    "area": "1.000 m²",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/9ea1dc45-62f4-47e5-aeae-13e0fdca62f11713301363bHyo.jpg",
    "href": "https://porthalimoveis.com.br/imovel/chacara-a-venda-no-bairro-ferreira-dos-matos-ribeirao-grandesp/934",
    "description": "Apresentamos uma excelente oportunidade para quem procura adquirir uma encantadora chácara no bairro Ferreira dos Matos, em Ribeirão Grande/SP. Esta bela propriedade conta com 4 dormitórios, sendo 1 suíte, e 2 banheiros,"
  },
  {
    "id": "78171217-d74e-4686-80af-b4024de5a91f",
    "title": "Chácara com frente para Rodovia SP-250",
    "address": "Área Rural de Capão Bonito/SP",
    "price": "R$300.000,00",
    "bedrooms": "2 Dormitórios, sendo 1 suíte",
    "garages": "3 Garagens",
    "bedroomCount": 2,
    "garageCount": 3,
    "area": "",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/a032f8cc-17a7-40ac-a254-7d0afc1c43e31741818328bjob.jpg",
    "href": "https://porthalimoveis.com.br/imovel/chacara-a-venda-com-frente-para-rodovia-sebastiao-ferraz-de-camargo-penteado-sp-250/968",
    "description": "Quer dar um upgrade na sua vida e viver em meio à natureza? Essa chácara à venda em Capão Bonito é o lugar perfeito para você! Com 2 dormitórios, sendo 1 suíte, e 2 banheiros, você terá todo o espaço que precisa para rel"
  },
  {
    "id": "17ffd427-8a2d-46ec-bffd-1f768a2f5680",
    "title": "Sobrado Padrão",
    "address": "Parque Balneário Oásis - Peruíbe/SP",
    "price": "R$550.000,00",
    "bedrooms": "4 Dormitórios, sendo 2 suítes",
    "garages": "2 Garagens",
    "bedroomCount": 4,
    "garageCount": 2,
    "area": "250,00 m² (Área total)",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/3c4fa159-c7ac-47fb-81be-76ed14cd96921745530125hlaF.jpg",
    "href": "https://porthalimoveis.com.br/imovel/sobrado-a-venda-no-bairro-parque-balneario-oasis-peruibesp/975",
    "description": "Venha conhecer este encantador sobrado à venda no bairro Parque Balneário Oásis em Peruíbe-SP. Com 4 Dormitórios, sendo 2 suítes e 4 Banheiros, esta espaçosa residência tem tudo o que você e sua família precisam para viv"
  },
  {
    "id": "3bd2e08d-a0ee-40f9-aee5-cddfbf65d8ef",
    "title": "Pavilhão/Galpão Salão Comercial",
    "address": "Terras do Embiruçu - Capão Bonito/SP, Frente para Rodovia Duplicada",
    "price": "R$14.000,00",
    "bedrooms": "",
    "garages": "",
    "bedroomCount": null,
    "garageCount": null,
    "area": "2.900,00 m² (Área total)",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/cc985b97-2b47-4868-93fe-ed8c93d5543c1762879563hZ2q.jpg",
    "href": "https://porthalimoveis.com.br/imovel/galpao-comercial-para-alugar-no-bairro-terras-do-embirucu-capao-bonito-sp-frente-para-rodovia-duplicada/1009",
    "description": "Alugue agora este amplo galpão comercial com 750m² mais 375m² totalizando 1.125 m² de área construída em uma área total de terreno de 2.900m², localizado no bairro Terras do Embiruçu em Capão Bonito-SP. Com estacionament"
  },
  {
    "id": "f8ff65af-9d9a-45c9-9fc0-0324ecb7ccfa",
    "title": "Área Rural",
    "address": "Rural - Capão Bonito/SP",
    "price": "R$3.700.000,00",
    "bedrooms": "",
    "garages": "",
    "bedroomCount": null,
    "garageCount": null,
    "area": "24,20 ha (Área total)",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/slides/3c69c446-87b0-46ae-bd5f-1172af45cbf817647094684Xss.jpg",
    "href": "https://porthalimoveis.com.br/imovel/area-para-hotel-fazenda-camping-a-venda-em-rural-capao-bonito-sp/340",
    "description": "Área total de 10 alqueires ou 242.000,00m2  Infraestrutura pronta de um Hotel Fazenda.  AREAS CONSTRUÍDAS: área total edificada de 6.900 m2, sendo 3.900 m2 de área pronta e 3.000 m2 sem acabamento ÁREA EXTERNA ·Ruas calç"
  }
]

export const highlights: Highlight[] = [
  {
    "title": "Sitio com 10 alqueires em Guapira/SP",
    "description": "Se você está em busca de um sítio à venda, com todas as comodidades que você precisa, não deixe de conhecer essa incrível oportunidade localizada no bairro Rural em Guapiara-SP. Com três dormitórios, sendo duas suítes, e dois banheiros, esse sítio é perfeito para quem busca espaço e conforto para toda a família. Além d",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/super-highlights/e00f36d2-1b11-465e-a90e-cda7ed800c691706112847aH6c.jpg",
    "href": "https://porthalimoveis.com.br/imovel/sitio-a-venda-no-bairro-rural-guapiarasp/912"
  },
  {
    "title": "Sitio divisa com Rio das Almas ...",
    "description": "Que tal ter seu próprio pedacinho de paraíso? Está à procura de um sítio com 30.000m² para chamar de seu? Então, pare tudo o que está fazendo e venha conferir essa oportunidade imperdível!  Imagine acordar todos os dias com o cantar dos pássaros e o cheirinho de natureza no ar. Esse sítio dos sonhos está localizado no ",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/super-highlights/409b1561-965e-4efe-bd8b-f21a04bb1d3d1706124943ObUs.jpg",
    "href": "https://porthalimoveis.com.br/imovel/sitio-com-divisa-em-rio-piscoso-capao-bonito-sp/388"
  },
  {
    "title": "Excelente oportunidade de adquirir um sítio localizado em área rural de Capão Bonito-SP.",
    "description": "Excelente oportunidade de adquirir um sítio localizado em área rural de Capão Bonito-SP. Com uma área total de 14,34 hectares, contendo uma área construída total de 650m² com uma bela represa e vários açudes com peixes, totalizando uma área total de 8.500m² com nascentes próprias, este imóvel oferece o espaço e a priva",
    "image": "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/media/98fb0439-493f-4bc8-907d-f21bbab74f51/settings/super-highlights/02712c66-76cf-4794-8148-170bb5efcdf51745355717uFES.jpg",
    "href": "https://www.youtube.com/watch?v=bW1_RIPdpsg"
  }
]
