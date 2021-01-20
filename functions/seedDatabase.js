const { createItems } = require('@keystonejs/server-side-graphql-client');
const casual = require('casual');

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

  const categories = await createItems({
    keystone,
    listKey: 'Category',
    items: [...new Set(casual.array_of_words(20))].map(() => ({
      data: { name: words(1, 2) },
    })),
  });

  const brands = await createItems({
    keystone,
    listKey: 'Brand',
    items: [...new Set(casual.array_of_words(15))].map(name => ({
      data: { name },
    })),
  });

  const tags = await createItems({
    keystone,
    listKey: 'Tag',
    items: [...new Set(casual.array_of_words(4))].map(name => ({
      data: { name, abbreviation: name.charAt(0) },
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
      ...[...Array(3).keys()].map(() => {
        const name = casual.word;
        return {
          data: {
            singular: ` ${name}`,
            plural: ` ${name}s`,
            singularAbbreviated: ` ${name}`,
            pluralAbbreviated: ` ${name}s`,
          },
        };
      }),
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
        unit: casual.random_element(['g', 'kg', 'ml', 'L']),
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
