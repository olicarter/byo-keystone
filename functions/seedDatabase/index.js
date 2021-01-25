const { createItems } = require('@keystonejs/server-side-graphql-client');
const casual = require('casual');

const pageItems = require('./pageItems');

const words = (from, to) => casual.words(casual.integer(from, to));

const getRandomArrayItems = (arr, n) => {
  let result = new Array(n);
  let len = arr.length;
  let taken = new Array(len);
  if (n > len)
    throw new RangeError('getRandom: more elements taken than available');
  while (n--) {
    let x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};

module.exports = async keystone => {
  await createItems({
    keystone,
    listKey: 'User',
    items: [
      {
        data: {
          email: 'me@olicarter.dev',
          name: 'Oli Carter',
          password: 'password',
          phone: '+37254583920',
          isAdmin: true,
          isSuperAdmin: true,
        },
      },
    ],
  });

  await createItems({
    keystone,
    listKey: 'Setting',
    items: [
      {
        data: {
          primaryColor: 'rgba(29, 119, 113, 1)',
          facebookUrl: 'https://www.facebook.com/bringyourownuk',
          instagramUrl: 'https://www.instagram.com/bringyourownuk',
          minOrderValue: 15,
          chooseDeliverySlotInfo:
            'The delivery rider will contact you with a more precise time on day of delivery.',
          orderSubmissionInfo:
            'Payment is taken by the rider on delivery. Price is dependant on stock levels on day of dispatch.',
          footerContent: `Bring Your Own Ltd is registered in England and Wales (#11247573), 147 Evelina Road, London, England, SE15 3HB

          [Privacy Policy](/privacy-policy)`,
        },
      },
    ],
  });

  await createItems({
    keystone,
    listKey: 'Page',
    items: pageItems,
  });

  const categories = await createItems({
    keystone,
    listKey: 'Category',
    items: [
      'Baking',
      'Beans and Pulses',
      'Bodycare',
      'Cereals',
      'Cleaning',
      'Condiments',
      'Dried Fruit',
      'Grains',
      'Haircare',
      'Herbs and Spices',
      'Jars',
      'M*lk',
      'Menstrual Products',
      'Nuts and Seeds',
      'Oil',
      'Pasta',
      'Sweets and Snacks',
      'Tea and Coffee',
      'Vinegars',
    ].map(name => ({ data: { name } })),
  });

  const brands = await createItems({
    keystone,
    listKey: 'Brand',
    items: [
      ...new Set(
        [...new Array(15).keys()].map(() => ({
          data: { name: casual.company_name },
        })),
      ),
    ],
  });

  const tags = await createItems({
    keystone,
    listKey: 'Tag',
    items: ['Gluten Free', 'Organic', 'Vegan', 'Vegetarian'].map(name => ({
      data: {
        name,
        abbreviation: name
          .match(/\b(\w)/g)
          .join('')
          .toLowerCase(),
      },
    })),
  });

  const units = await createItems({
    keystone,
    listKey: 'Unit',
    items: [
      {
        data: {
          singular: ' gram',
          plural: ' grams',
          singularAbbreviated: 'g',
          pluralAbbreviated: 'g',
        },
      },
      {
        data: {
          singular: ' millilitre',
          plural: ' millilitres',
          singularAbbreviated: 'ml',
          pluralAbbreviated: 'ml',
        },
      },
      {
        data: {
          singular: ' kilogram',
          plural: ' kilograms',
          singularAbbreviated: 'kg',
          pluralAbbreviated: 'kg',
        },
      },
      {
        data: {
          singular: ' litre',
          plural: ' litres',
          singularAbbreviated: 'L',
          pluralAbbreviated: 'L',
        },
      },
      {
        data: {
          singular: ' item',
          plural: ' items',
          singularAbbreviated: ' item',
          pluralAbbreviated: ' items',
        },
      },
    ],
  });

  const containers = await createItems({
    keystone,
    listKey: 'Container',
    items: [...Array(20).keys()].map(() => ({
      data: {
        price: casual.random_element([
          '0.00',
          casual.double(0.6, 1.2).toFixed(2),
        ]),
        size: casual.integer(50, 500).toString(),
        unit: casual.random_element(['g', 'ml']),
        type: casual.random_element(['bag', 'bottle', 'jar', 'tin']),
      },
    })),
  });

  await createItems({
    keystone,
    listKey: 'Product',
    items: [...new Set(casual.array_of_words(200))].map(word => ({
      data: {
        name: `${word} ${words(0, 3)}`,
        category: {
          connect: {
            id: casual.random_element(categories).id,
          },
        },
        brand: {
          connect: {
            id: casual.random_element(brands).id,
          },
        },
        allergenInfo: casual.sentence,
        description: casual.description,
        ingredients: casual.array_of_words(15).join(', '),
        origin: casual.word,
        tags: {
          connect: getRandomArrayItems(
            tags,
            casual.integer(0, tags.length),
          ).map(({ id }) => ({ id })),
        },
        variants: {
          create: [...Array(casual.integer(0, 4)).keys()].map(() => ({
            ...(casual.boolean ? { name: words(1, 4) } : {}),
            ...(casual.boolean
              ? {
                  container: {
                    connect: { id: casual.random_element(containers).id },
                  },
                }
              : {}),
            increment: casual.integer(1, 500),
            incrementPrice: casual.double(0.05, 25.0).toFixed(2),
            unit: {
              connect: { id: casual.random_element(units).id },
            },
            allergenInfo: casual.sentence,
            description: casual.description,
            ingredients: casual.array_of_words(15).join(', '),
            origin: casual.word,
            tags: {
              connect: getRandomArrayItems(
                tags,
                casual.integer(0, tags.length),
              ).map(({ id }) => ({ id })),
            },
          })),
        },
      },
    })),
  });
};
