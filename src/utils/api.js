import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const api = axios.create({
    baseURL: 'http://localhost:38090',
    headers: {
      'X-Request-Id' : uuidv4(),
      'Content-Type': 'application/json',
      'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjE3NzYyNTYxOTM5NzU3NzExMzYsInVzZXJuYW1lIjoiam9obiIsImlhdCI6MTcxOTcyNzMyNCwiZXhwIjoxNzIwMzMyMTI0fQ.ol2K9tO-vGtoDVVKewSb7asr44g2JptLf0cCXNJ4wDE'

    }
  });


  export const find_capital_records =  (page_num) => {
    console.log("page_num:", page_num)
    var query = {};
    var page_param = {
      "pageSize":10,
      "pageNum":page_num,
      "query":query
    };
    try {
        return api.post("user-service/api/account/v1/find-capital-records", page_param);
    } catch (error) {
        return error.response;
    }
    
   
  }

  export const find_coins =  (page_num) => {
    var query = {};
    var page_param = {
      "pageSize":20,
      "pageNum":page_num,
      "query":query
    };

    try {
        return api.post("user-service/public-api/coin/v1/find-coins", page_param);
    } catch (error) {
        return error.response;
    }

   
    
    
    
  }

  export const find_accounts = () => {
    try {
        return api.post("user-service/api/account/v1/find-accounts", {});
    } catch (error) {
        return error.response;
    }

   
  
   
  }

  export const find_orders = (page_num) => {
    var query = {};
    var page_param = {
      "pageSize":10,
      "pageNum":page_num,
      "query":query
    };
    try {
        return api.post("user-service/api/order/v1/find-orders", page_param);
    } catch (error) {
        return error.response;
    }
   

  } 

  export const find_order = (order_id) => {
    var query = {
      "orderId":order_id
    };
    try {
        return api.post("user-service/api/order/v1/find-order", query);
    } catch (error) {
        return error.response;
    }

   

  }

  export const EnumKLineInterval = {
    ONE_MINUTE:'ONE_MINUTE',
    FIFTEEN_MINUTE:'FIFTEEN_MINUTE',
    HALF_HOUR:'HALF_HOUR',
    ONE_HOUR:'ONE_HOUR',
    SIX_HOUR :'SIX_HOUR',
    ONE_DAY:'ONE_DAY',
    ONE_WEEK:'ONE_WEEK',
    ONE_MONTH:'ONE_MONTH',
    ONE_YEAR:'ONE_YEAR'
  }


  export const find_kline = (coin_id, interval, page_size, page_num) => {
    var page_param = {
      "pageSize":page_size,
      "pageNum":page_num,
      "query":query
    };
    var query = {
      "coinId":coin_id,
      "interval":interval
    };
    try {
        return api.post("quote-service/public-api/kline/v1/find-kline", page_param);
    } catch (error) {
        return error.response;
    }


    
  }




  export const EnumEntrustSide = {
    BUY:'BUY',
    SELL:'SELL'
  }
  export const EnumEntrustType = {
    MARKET:1,
    NORMAL_LIMIT: 2,
    PREMIUM_LIMIT: 3
  }
  export const EnumEntrustProp = {
    FOK:1,
    IOC: 2
  }

 export const EnumOrderStatus = {
    CANCELLED:-20, // "订单已取消"

    CANCELLING:-10, //"订单取消中"

    CREATE:10, //"订单已创建"

    SUBMITTED:15, // "订单已提交"

    TO_FILL: 20, // "订单待成交"

    PARTIAL_FILLED: 30, // "订单部分成交"

    PARTIAL_FILLED_AND_CANCEL: 40, // "订单成交已取消"

    FILLED: 50, // "订单已成交"

 }

 export const enable_cancel_order = (order_status) => {
    console.log(order_status)
    return EnumOrderStatus.PARTIAL_FILLED === order_status
     || EnumOrderStatus.TO_FILL === order_status;
   }




export const cancel_order = async (order_id) => {
    var query = {
      "orderId":order_id
    };
    try {
           return await api.post("user-service/api/order/v1/cancel-order", query);
       } catch (error) {
           return error.response;
       }

  }
  

  export const create_order = (create_order_req) => {
    try {
        return api.post("user-service/api/order/v1/create-order", create_order_req);
    } catch (error) {
        return error.response;
    }
    
  }


  export const register = (username) => {
    try {
        return api.post("user-service/public-api/user/v1/register", username);
    } catch (error) {
        return error.response;
    }
    
  }



