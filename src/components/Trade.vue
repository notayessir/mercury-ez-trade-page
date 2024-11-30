<script setup>
import { ref } from 'vue';
import * as api from '../utils/api';
import { Client } from '@stomp/stompjs';
import { createChart } from 'lightweight-charts';

// global pagination varible
const current_page = ref(1);
const total = ref(0);

// switch coin pair component
const coin_list = ref([]);
const selected_coin_id = ref(null);

import { message } from 'ant-design-vue';
const [messageApi, contextHolder] = message.useMessage();



const handle_page_change = (menu, page_num) => {
  current_page.value = page_num;
  if(menu === 'coin_list'){
    
    api.find_coins(page_num).then(resp => {
      coin_list.value = resp.data.data.records;
      total.value = resp.data.data.total;
    });
    
  } else if(menu === items.value[0].key){

    api.find_orders(page_num).then(resp => {
      order_list.value = resp.data.data.records;
      total.value = resp.data.data.total;
    });
  }
}


const open_drawer = ref(false);

const after_open_change = status => {
  console.log('open', status);
  
};
const show_drawer = () => {
  
  api.find_coins(1).then(resp => {
      coin_list.value = resp.data.data.records;
      total.value = resp.data.data.total;
      open_drawer.value = true;
    });
};

const alter_coin = (coin_id) => {
  console.log("coin_id:" + coin_id );
  selected_coin_id.value = coin_id;
  open_drawer.value = false;
};




import { h } from 'vue';
import { UnorderedListOutlined, DollarCircleOutlined } from '@ant-design/icons-vue';
const current_key = ref(['order']);
const items = ref([
  {
    key: 'order',
    icon: () => h(UnorderedListOutlined),
    label: '当前委托',
    title: '当前委托',
  },
  {
    key: 'asset',
    icon: () => h(DollarCircleOutlined),
    label: '资产',
    title: '资产',
  }
]);

const asset_list = ref([]);
const order_list = ref([]);

const handle_menu_click = (info) => {
  current_key.value = [info.key];
  if(info.key === items.value[0].key){
    console.log("order");
    api.find_orders(1).then(resp => {
      order_list.value = resp.data.data.records;
      total.value = resp.data.data.total;
    });
    
  } else if(info.key === items.value[1].key){
    console.log("asset");
    api.find_accounts().then(resp => {
      asset_list.value = resp.data.data;
    });
  } 
};



const clinch_records = ref([]);
const open = ref(false);
const show_order_detail = (order_id) => {
  api.find_order(order_id).then(resp => {
    clinch_records.value = resp.data.data.clinchRecords;
    open.value = true;
  });
};
const close_order_detail = e => {
  open.value = false;
};

import { reactive,toRaw } from 'vue';


const create_order_param = reactive({
  coinId : null,
  side : null,
  basePrice : null,
  entrustQty : 1,
  entrustPrice : null,
  entrustAmount : null,
  entrustProp : null,
  entrustType : api.EnumEntrustType.NORMAL_LIMIT,
});

const update_amount_event = () => {
  create_order_param.entrustAmount = create_order_param.entrustQty * create_order_param.entrustPrice;
};

const update_qty_event = () => {
  create_order_param.entrustPrice = create_order_param.entrustAmount / create_order_param.entrustQty;
};

const create_order_event = (side) => {
  create_order_param.side = side;
  create_order_param.coinId = selected_coin_id.value;
  console.log('submit!', toRaw(create_order_param));
  api.create_order(create_order_param).then(resp => {
    if(resp.data.code === 'e00000'){
      messageApi.info(resp.data.message);
    } else{
      messageApi.error(resp.data.message);
    }
  })  

};

const cancel_order_event = (order_id) => {
  api.cancel_order(order_id).then(resp => {
    if(resp.data.code === 'e00000'){
      messageApi.info(resp.data.message);
    } else{
      messageApi.error(resp.data.message);
    }
  })  
};




const col_style = {
  border: '1px solid #e8e8e8', 
};



const clinch_columns = [
  {
    title: '时间',
    dataIndex: 'time',
  },
  {
    title: '价格',
    className: 'column-money',
    dataIndex: 'price',
  },
  {
    title: '数量',
    dataIndex: 'qty',
  },
];

const entrust_columns = [
  {
    title: '买',
    dataIndex: 'buy',
  },
  
  {
    title: '卖',
    dataIndex: 'sell',
  },
];


const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
];





</script>

<template>
  <context-holder />
    <a-layout-content style="padding-left: 50px; padding-right: 50px;">
        <a-row>
           
            <a-col :span="24" >

              <a-space >
                <a-button type="text">当前币对：</a-button>
                <a-button type="link" @click="show_drawer">切换币对</a-button>
              </a-space>
             

  <a-drawer
    v-model:open="open_drawer"
    class="custom-class"
    root-class-name="root-class-name"
    :root-style="{ color: 'blue' }"
    style="color: red"
    title="切换币对"
    placement="left"
    @after-open-change="after_open_change">

    <a-list  item-layout="horizontal" :data-source="coin_list">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta>
                      <template #title>
                        <a @click="alter_coin(item.id)">
                          {{ item.quoteCurrency + "/" + item.baseCurrency }}
                        </a>

                      </template>
                    </a-list-item-meta>
                  </a-list-item>
  
  </template>
</a-list>
<a-pagination v-model:current="current_page" simple :total="total" @change="handle_page_change('coin_list', $event)"/>
  </a-drawer>
                

            </a-col>
        </a-row>


        <a-row>
            <a-col :span="13" >k 线</a-col>


            <a-col :span="11" :style="col_style">



                <a-form :model="create_order_param" >


                  <a-form-item label="订单类型">
      <a-radio-group v-model:value="create_order_param.entrustType" >
        <a-radio :value="api.EnumEntrustType.MARKET">市价单</a-radio>
        <a-radio :value="api.EnumEntrustType.NORMAL_LIMIT">限价单</a-radio>
        <a-radio :value="api.EnumEntrustType.PREMIUM_LIMIT">高级限价单</a-radio>
    </a-radio-group>
    </a-form-item>

    <a-form-item label="订单属性" v-if="create_order_param.entrustType === api.EnumEntrustType.PREMIUM_LIMIT" >
      <a-radio-group v-model:value="create_order_param.entrustProp">
        <a-radio-button :value="api.EnumEntrustProp.FOK">FOK(全成或取消)</a-radio-button>
        <a-radio-button :value="api.EnumEntrustProp.IOC">IOC(部成或全成并取消剩余)</a-radio-button>
      </a-radio-group>

    </a-form-item>

    <a-form-item label="数量"  v-if="create_order_param.entrustType === api.EnumEntrustType.MARKET">
      <a-input-number 
    v-model:value="create_order_param.entrustQty"
    style="width: 200px"
    :min="0"
    :max="100"
    :step="1"
    string-mode
  />
    </a-form-item>
   
    <a-form-item label="数量"  v-if="create_order_param.entrustType != api.EnumEntrustType.MARKET">
      <a-input-number @change="update_amount_event"
    v-model:value="create_order_param.entrustQty"
    style="width: 200px"
    :min="0"
    :max="100"
    :step="1"
    string-mode
  />
    </a-form-item>

    <a-form-item label="价格"   v-if="create_order_param.entrustType != api.EnumEntrustType.MARKET">

      <a-input-number @change="update_amount_event"
    v-model:value="create_order_param.entrustPrice"
    style="width: 200px"
    :min="0"
    :max="100"
    :step="1"
    string-mode
  />
    </a-form-item>

    <a-form-item label="成交金额" >

<a-input-number  @change="update_qty_event"
v-model:value="create_order_param.entrustAmount"
style="width: 200px"
:min="0"
:max="100"
:step="1"
string-mode
/>
</a-form-item>

    


    <a-form-item >
      <a-button type="primary" @click="create_order_event(api.EnumEntrustSide.BUY)">买</a-button>

      <a-button style="margin-left: 10px"  @click="create_order_event(api.EnumEntrustSide.SELL)">卖</a-button>
    </a-form-item>
  
  </a-form>

          



                
            </a-col>
           
           
        </a-row>
        <a-row>
            <a-col :span="6" >
              委托订单
              <a-table :columns="entrust_columns" :data-source="data" size="small" bordered :pagination="false"/>
            </a-col>

            <a-col :span="1" >
              
            </a-col>


            <a-col :span="6" >
              最新成交

             
            <a-table :columns="clinch_columns" :data-source="data" size="small" :pagination="false" />
 


           
            </a-col>

            <!-- <a-col :span="1">
            </a-col> -->

            <a-col :span="11">
                <a-menu v-model:selectedKeys="current_key" mode="horizontal" :items="items" @click="handle_menu_click"/>

                <a-list v-if="current_key[0] === 'asset'" item-layout="horizontal" :data-source="asset_list">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta>
                      <template #title>
                        <a >{{ item.currency }}</a>
                        <p>可用数量：{{ item.available }} <br/>冻结数量：{{ item.hold }}</p>
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </template>
                
                </a-list>
                

                <a-list v-if="current_key[0] === 'order'"  item-layout="horizontal" :data-source="order_list">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta>
                      <template #title>
                        <a  @click="show_order_detail(item.order.id)">{{ item.order.coinQuoteCurrency + "/" + item.order.coinBaseCurrency}} </a>
                        <p>
                          订单方向：{{ item.order.entrustSide }}
                          <br/>
                         
                          订单类型：{{ item.order.entrustTypeDesc }}
                          <br/>
                          订单状态： {{ item.order.orderStatusDesc }}

                          <a-button type="link" v-if="api.enable_cancel_order(item.order.orderStatus)" 
                          @click="cancel_order_event(item.order.id)">撤单</a-button>

                          <br/>
                          订单 id：{{ item.order.id }} 
                          <br/>委托数量：{{ item.order.entrustQty }}，委托价格：{{ item.order.entrustPrice }}，委托金额：{{ item.order.entrustAmount }}
                        
                        <br/>成交数量：{{ item.order.clinchQty }}，成交金额：{{ item.order.clinchAmount }}
                        <br/>
                          交易日：{{ item.order.tradeDate }}，更新时间：{{ item.order.updateTime }}
                      </p>
                      </template>
                    </a-list-item-meta>
                  </a-list-item>

                </template>

                <a-modal v-model:open="open" title="成交明细" centered @ok="close_order_detail">

                  <a-list  item-layout="horizontal" :data-source="clinch_records">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta>
                      <template #title>
                        
                        <p>
                          
                          流水 id：{{ item.id }} 
                          

                        <br/>成交数量：{{ item.qty }}，成交价格：{{ item.price }}
                        <br/>
                          成交时间：{{ item.createTime }}
                      </p>
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
  
  </template>
</a-list>

                  
                </a-modal>
                

                <a-pagination v-model:current="current_page" simple :total="total" @change="handle_page_change('order', $event)"/>
                </a-list>



            </a-col>

            <!-- <a-col :span="4"></a-col> -->
        </a-row>
 
     </a-layout-content>
 </template>

 <style scoped>

</style>