const axios = require('axios');

const BASE_URL = 'http://localhost:4000/graphql';

module.exports = {
  isEqualData: function eq (value, other) {
    let type = Object.prototype.toString.call(value);

    if (type !== Object.prototype.toString.call(other)) return false;

    if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

    let valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    let otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;

    let compare = function (item1, item2) {
      let itemType = Object.prototype.toString.call(item1);

      if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
        if (!eq(item1, item2)) return false;
      } else {
        if (itemType !== Object.prototype.toString.call(item2)) return false;

        if (itemType === '[object Function]') {
          if (item1.toString() !== item2.toString()) return false;
        } else {
          if (item1 !== item2) return false;
        }
      }
    };

    if (type === '[object Array]') {
      for (let i = 0; i < valueLen; i++) {
        if (compare(value[i], other[i]) === false) return false;
      }
    } else {
      for (let key in value) {
        if (value.hasOwnProperty(key)) {
          if (compare(value[key], other[key]) === false) return false;
        }
      }
    }

    return true;
  },

  includesObject (a, o) {
    let result = false;
    for (let i = 0; i < a.length; ++i) {
      let includes = true;
      for (let key in o) {
        if (o.hasOwnProperty(key)) {
          if (o[key] !== a[i][key]) {
            includes = false;
            break;
          }
        }
      }
      result = result || includes;
      if (result) {
        break;
      }
    }
    return result;
  },

  convertIds: function conv (data) {
    let type = Object.prototype.toString.call(data);
    if (type === '[object Object]') {
      if (data.hasOwnProperty('id')) {
        data.id = parseInt(data.id, 10);
      }
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          let t = Object.prototype.toString.call(data[key]);
          if (['[object Array]', '[object Object]'].indexOf(t) >= 0) {
            conv(data[key]);
          }
        }
      }
    } else if (type === '[object Array]') {
      for (let i = 0; i < data.length; ++i) {
        let t = Object.prototype.toString.call(data[i]);
        if (['[object Array]', '[object Object]'].indexOf(t) >= 0) {
          conv(data[i]);
        }
      }
    }
  },

  sendQuery (load) {
    return axios.get(BASE_URL, {
      params: {
        query: load
      }
    });
  },

  sendMutation (load) {
    return axios.post(BASE_URL, {
      query: load
    });
  }
};
