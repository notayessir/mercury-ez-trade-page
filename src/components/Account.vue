<script setup>
import { onMounted, ref } from 'vue';
import * as api from '../utils/api';


import { h } from 'vue';
import { UnorderedListOutlined, DollarCircleOutlined } from '@ant-design/icons-vue';
const selected_key = ref(['asset']);
const items = ref([
  {
    key: 'asset',
    icon: () => h(DollarCircleOutlined),
    label: '资产',
    title: '资产',
  },
  {
    key: 'capital_record',
    icon: () => h(DollarCircleOutlined),
    label: '资金流水',
    title: '资金流水',
  },
  {
    key: 'order',
    icon: () => h(UnorderedListOutlined),
    label: '所有委托',
    title: '所有委托',
  },

]);




onMounted(async () => {
  try {
    find_accounts_event();
  } catch (error) {
    console.error('Error:', error)
  }
});



const account_list = ref([]);
const find_accounts_event = () => {
  api.find_accounts().then( resp => {
    account_list.value = resp.data.data;
  });
};


const capital_record_list_current_page = ref(1);
const capital_record_list = ref([]);
const capital_record_list_total = ref(0);
const find_capital_records_event = (page_num) => {
  api.find_capital_records(page_num).then(resp => {
      capital_record_list.value = resp.data.data.records;
      capital_record_list_total.value = resp.data.data.total;
    });
};

const order_list_current_page = ref(1);
const order_list = ref([]);
const order_list_total = ref(0);
const find_orders_event = (page_num) => {
  api.find_orders(page_num).then(resp => {
      order_list.value = resp.data.data.records;
      order_list_total.value = resp.data.data.total;
    });
};











const handle_menu_click = (info) => {
  selected_key.value = [info.key];
  if(info.key === items.value[0].key){

    find_accounts_event();
    
  } else if(info.key === items.value[1].key){

    find_capital_records_event(1);
    

  } else if(info.key === items.value[2].key){
    
    find_orders_event(1);
    
  }
};


const handle_page_change = (menu, page_num) => {
  current_page.value = page_num;
  if(menu === items.value[1].key){

    find_capital_records_event(page_num);
    
   
    
  } else if(menu === items.value[2].key){

    find_orders_event(page_num);
    
  }
}

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

const cancel_order = (order_id) => {
  console.log('cancel!', order_id);

};


</script>

<template>

  


    <a-layout-content style="padding-left: 50px; padding-right: 50px;">
        
      
        
        <a-row>
            <a-col :span="3">
                
            </a-col>
            <a-col :span="18">

             
          
                <a-menu v-model:selectedKeys="selected_key" mode="horizontal" :items="items" @click="handle_menu_click" />
                <a-list v-if="selected_key[0] === 'asset'" item-layout="horizontal" :data-source="account_list">
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

                <a-list v-if="selected_key[0] === 'capital_record'"  item-layout="horizontal" :data-source="capital_record_list">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta>
                      <template #title>
                        <a >{{ item.currency }} {{ item.direction == 10 ? "+" + item.num : "-" + item.num }}  </a>
                        <p>说明：{{ item.businessCodeDesc }}
                           <br/>
                          发生时间：{{ item.createTime }}</p>
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </template>

                <a-pagination v-model:current="capital_record_list_current_page" simple :total="capital_record_list_total" @change="handle_page_change('capital_record', $event)" />

                </a-list>


                <a-list v-if="selected_key[0] === 'order'"  item-layout="horizontal" :data-source="order_list">
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
                          @click="cancel_order(item.order.id)">撤单</a-button>
                          
                          
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
                <a-pagination v-model:current="order_list_current_page" simple :total="order_list_total" @change="handle_page_change('order', $event)"/>
                </a-list>
                     

            </a-col>
            
            <a-col :span="3">
              
            </a-col>
        </a-row>
 
     </a-layout-content>
 </template>

 <style scoped>

</style>