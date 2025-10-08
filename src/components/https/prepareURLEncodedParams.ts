export const arrayToUrlString = (key: string, value: string[]) => {
  let arrayUrl = value.map((item: string | number | boolean) => {
    return `${key}[]=${item}`;
  });
  return arrayUrl.join("&");
};
export const prepareURLEncodedParams = (url: string, params: any) => {
  let paramsArray = Object.keys(params)
    ?.map((key) => {
      const value = params[key];

      if (value && value.length) {
        if (Array.isArray(value)) {
          return arrayToUrlString(key, value);
        }
        return `${key}=${params[key]}`;
      } else if (value) {
        return `${key}=${params[key]}`;
      } else {
        return "";
      }
    })
    .filter((e) => e.length);

  let paramsURLs = paramsArray.filter((e) => e).join("&");

  if (paramsURLs) {
    return url + "?" + paramsURLs;
  }
  return url;
};
