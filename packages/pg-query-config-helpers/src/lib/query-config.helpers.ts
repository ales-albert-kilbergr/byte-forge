import {
  escapeIdentifier,
  escapeLiteral,
  type QueryConfig
} from 'pg';

export const appendString = function <Q extends QueryConfig>(
  queryConfig: Q,
  text: string
): Q {
  queryConfig.text += text;

  return queryConfig;
};

export const appendText = function <Q extends QueryConfig>(
  queryConfig: Q,
  text: string
): Q {
  if (!queryConfig.text) {
    queryConfig.text = text;
  } else if (/\s$/.test(queryConfig.text)) {
    queryConfig.text += text;
  } else {
    queryConfig.text += ' ' + text;
  }
  return queryConfig;
};

export const appendIdentifier = function <Q extends QueryConfig>(
  queryConfig: Q,
  identifier: string
): Q {
  return appendText(
    queryConfig,
    identifier.split('.').map(escapeIdentifier).join('.')
  );
};

export const appendLiteral = function <Q extends QueryConfig>(
  queryConfig: Q,
  input: string
): Q {
  appendText(queryConfig, escapeLiteral(input));

  return queryConfig;
};

export const appendLiterals = function <Q extends QueryConfig>(
  queryConfig: Q,
  input: string[],
  separator = ', '
): Q {
  queryConfig.values = queryConfig.values || [];

  for (let i = 0; i < input.length; i++) {
    const inputStr = input[i];
    if (inputStr === void 0) continue;

    const binding = escapeLiteral(inputStr);
    queryConfig.text += binding;
    if (i < input.length - 1) {
      queryConfig.text += separator;
    }
  }
  return queryConfig;
}

export const appendQueryConfig = function <
  A extends QueryConfig,
  B extends QueryConfig
>(source: A, ext: B): A & B {
  const sourceValuesLength = source.values?.length || 0;

  appendText(
    source,
    ext.text.replace(/\$(\d+)/gm, (_, p1) => {
      const index = parseInt(p1, 10);
      return `$${index + sourceValuesLength}`;
    })
  );

  source.values = (source.values || []).concat(ext.values || []);

  return source as A & B;
};

export const bindValue = function <Q extends QueryConfig>(
  queryConfig: Q,
  value: unknown
): Q {
  queryConfig.values = queryConfig.values || [];

  if (value === null) {
    queryConfig.text += 'NULL';
  } else if (value === void 0) {
    queryConfig.text += 'DEFAULT';
  } else {
    const ix = queryConfig.values.length + 1;
    const binding = `$${ix}`;

    queryConfig.text += binding;
    queryConfig.values.push(value);
  }

  return queryConfig;
};

export const bindValues = function<Q extends QueryConfig>(
  queryConfig: Q,
  values: unknown[],
  separator = ', '
): Q {
  queryConfig.values = queryConfig.values || [];
  let ix = queryConfig.values.length + 1;

  for (let i = 0; i < values.length; i++) {
    const binding = `$${ix}`;
    queryConfig.text += binding;
    queryConfig.values.push(values[i]);

    if (i < values.length - 1) {
      queryConfig.text += separator;
    }
    ix++;
  }
  return queryConfig;
}

export const merge = function<A extends QueryConfig, B extends QueryConfig>(
  source: A,
  ext: B
): A & B {
  const valuesA = source.values || [];
  const valuesB = ext.values || [];

  return {
    ...source,
    ...ext,
    name: source.name,
    text:
      source.text +
      ' ' +
      ext.text.replace(/\$(\d+)/gm, (_, p1) => {
        const index = parseInt(p1, 10);
        return `$${index + valuesA.length}`;
      }),
    values: valuesA.concat(valuesB),
  } as A & B;
}

export const openBrackets = function<Q extends QueryConfig>(queryConfig: Q): Q {
  return appendText(queryConfig, '(');
}

export const closeBrackets = function<Q extends QueryConfig>(queryConfig: Q): Q {
  return appendText(queryConfig, ')');
}
