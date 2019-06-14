import React, { Component, Fragment } from 'react';
// import axios from 'axios';
import $ from 'jquery'
import 'antd/dist/antd.css';
import './OCR.css';
import { Layout, Radio, Button, Modal } from 'antd'; 
const { Header, Content } = Layout;

class OCR extends Component{
  constructor(props){
    super(props)
    this.state = {
      move: false, // 动画的判定，为true时执行扫描的动画
      inputValue: "", // 图片待识别区域的图片base64
      remove: false, // 界面初始化时，图片待识别区域的提示框
      radioValue: 'A', // 默认选中的图片类型
      list:[], // 图片待选区存储的图片数组
      type:'', // 识别的图片类型
      // distinguish_name:[], // 识别结果的属性
      // distinguish_value:[], // 识别结果的值
      result1:'',
      result2:''
    }
    this.handlechoose = this.handlechoose.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.radioGroup = this.radioGroup.bind(this);
    this.result1 = this.result1.bind(this);
    this.result2 = this.result2.bind(this);
    // this.sss = this.sss.bind(this);
    // this.getPic = this.getPic.bind(this)
    // this.radioChange = this.radioChange.bind(this);
  }
  render(){
    return(
      <Fragment>
        <div id='OCR'>
          <Header>
            <div>
              <span className='info-left'></span>
              <span>OCR识别验证</span>
              <span className='info-right'></span>
            </div>
          </Header>
          <Content id='content'>

            {/* OCR识别区域 */}

            <div id='ocrTips'>
              <div className='scanning'>
                <div className='top_border'></div>
                <div className='right_border'></div>
                <div className='bottom_border'></div>
                <div className='left_border'></div>
                <Button type='dashed' className={ this.state.move === false ? 'btn' : 'btn hidden' } onClick={ this.handlechoose }>选择图片</Button>

                {/* 开始显示的关于OCR的消息 */}
                <div className='imageLarge'>
                  <div className={ this.state.remove ===  true ? '' : 'blank' }>
                    <div className={ this.state.remove ===  true ? '' : 'tips' }>点击下方按钮，可选择并识别图片上的文字内容和数字，智能提取为可编辑的文本，并将选取的图片放入下方的待选区域，一次性最多选取5张</div>
                    <img src={ this.state.inputValue } alt=''></img>
                  </div>
                </div>

                {/* 这个input为文件选择，用上面的button替代了 */}
                <input type='file'
                 onChange={ this.handleChange } 
                 style={{ display:'none' }} 
                 multiple="multiple" 
                 accept=".jpeg,.jpg,.png"
                 ref={ input => this.file = input }></input>

                {/* 扫描区域的扫描线和背景 */}
                <div className={ this.state.move === false ? 'begin' : 'begin end' }>
                  <div className={ this.state.move === false ? '' : 'placeholder' }></div>
                  <div className='line'></div>
                </div>
              </div>
              <div className='recognition'>
                <Radio.Group onChange={ this.radioGroup } id='Redio' defaultValue="自动识别类型" buttonStyle="solid">
                  <Radio.Button onChange={ this.radioChange } className='redio first' value="自动识别类型">自动识别类型</Radio.Button>
                  <Radio.Button onChange={ this.radioChange } className='redio second' value="二代身份证">二代身份证</Radio.Button>
                  <Radio.Button onChange={ this.radioChange } className='redio third' value="驾驶证">驾驶证</Radio.Button>
                  <Radio.Button onChange={ this.radioChange } className='redio fourth' value="行驶证">行驶证</Radio.Button>
                  <Radio.Button onChange={ this.radioChange } className='redio fifth' value="银行卡">银行卡</Radio.Button>
                  <Radio.Button onChange={ this.radioChange } className='redio sixth' value="增值税发票">增值税发票</Radio.Button>
                </Radio.Group>
                <Button type="primary" className='btn' disabled={ this.state.move } onClick={ this.handleMove }>开始识别</Button>
              </div>
            </div>
            
            {/* 图片存储区域 */}

            <div className='pic-storage'>
              <div>
                <span className='info-left'></span>
                <span>图片待选区域</span>
                <span className='info-right'></span>
              </div>
              <div className='picture'>
                { this.getPic() }
              </div>  
            </div>

            {/* 识别结果 */}
            <div className='distinguish'>
              <div>
                <span className='info-left'></span>
                <span>识别结果</span>
                <span className='info-right'></span>
              </div>
              <div className='result'>
                <div className='local'>
                  <div style={{ textAlign:'center',fontSize:'24px' }}>本地服务识别结果</div>
                  <p style={{ margin:'10px 0 10px 20px' }}>类型：{ this.state.type }</p>
                  <div className='result_name'>
                    <textarea rows="10" cols="20" ref={ local => this.local = local } onChange={ this.result1 }></textarea>
                  </div>
                </div>
                <div className='server'>
                  <div style={{ textAlign:'center',fontSize:'24px' }}>云服务识别结果</div>
                  <p style={{ margin:'10px 0 10px 20px' }}>类型：{ this.state.type }</p>
                  <div className='result_value'>
                    <textarea rows="10" cols="20" ref={ yun => this.yun = yun } onChange={ this.result2 }></textarea>
                  </div>
                </div>
              </div>
            </div>
          </Content>
        </div>
      </Fragment>
    )
  }

  // 选择文件点击后触发，把扫描区的提示语隐藏
  handlechoose(){
    this.file.click();
    this.setState(() => ({
      remove: true
    }))
  }

  // 选择文件后调用的函数
  uploader(fileLength){
    const reader = new FileReader();
    const upload = this.file.files;
    const that = this;
    reader.readAsDataURL(upload[fileLength]);
    this.setState(()=>({    // 选择好后先清空数据，之后读取新数据后再加入进去
      list: []
    }))
    reader.onload = function(){
      const newList = that.state.list;
      newList.push(this.result);
      that.setState(()=>({
        list: newList
      }))
    }
  }

  // 单选框变动后改变数据
  radioGroup(e){
    const value = e.target.value;
    this.setState(() => ({
      radioValue: value
    }))
  }

  // 选择了文件后调用uploader函数进行批量读取，并且对于选择的第一个文件立即读取，两次的读取存放不同的地方，提供需求
  handleChange(){
    let image;
    const that = this;
    let fileLength = 0;
    const reader = new FileReader();
    const upload = this.file.files;
    const length = upload.length;
    // 进行判断，如果在值的取值内则进行
    if( length > 0 && length <= 5 ){
      for(let i = 0; i < length; i ++){
        if( fileLength < length ){
          this.uploader(fileLength);
        }
        fileLength ++;
      }
      // 读取第一个文件
      reader.readAsDataURL(upload[0]);
      reader.onload = function(e){
        image = this.result;
        that.setState(() => ({
          inputValue: image
        }))
      }
    }else if(length > 5){                 //如果选择的数量大于5个，弹出提示框
      Modal.warning({
        title: '警告',
        content: '您所选的图片张数大于5张，请重新选择',
      });
    }
  }

  // 点击开始识别触发，利用move修改元素的样式，实现动画
  handleMove(){
    // 每次点击清空值
    this.setState(() => ({
      type: ''
    }))
    this.local.value = '';
    this.yun.value = '';
    if(this.state.inputValue){
      let ocrType;
      // eslint-disable-next-line default-case
      switch (this.state.radioValue){
        case '自动识别类型': ocrType = "A";
          break;
        case '二代身份证': ocrType = "2";
          break;
        case '驾驶证': ocrType = "5";
          break;
        case '行驶证': ocrType = "6";
          break;
        case '银行卡': ocrType = "17";
          break;
        case '增值税发票': ocrType = "V";
      }
      let fileBase64Str = this.state.inputValue.split(',')[1];
      const data = {
       "fileBase64Str":fileBase64Str,
        "ocrType":ocrType,
        "imgType":"jpg"
      }
      const that = this;
      $.ajax({
        url:'http://192.168.0.4:8090/h5img/admin/ocrContrast/ocrRecord.do',
        type:'post',
        contentType: 'application/json',
        dataType:'json',
        data:JSON.stringify(data),
        success:function(res){
          if(res){
            that.setState(() => ({
              move: false
            }))
          }
          const result = res.data;
          // 识别成功
          if(result !== null){
            let type = that.state.radioValue;
            that.setState(() => ({
              type: type
            }))
            // 如果有华为数据，首先使用，否则使用其他
            if(result.huawei){
              const res = result.huawei.result;
              that.setState(() => ({
                result:res
              }))
              that.local.value = res;
            }
            if(result.went){
              const res = result.went.result;
              that.setState(() => ({
                result:res
              }))
              that.yun.value = res;
            }
          }else if(res.status === 500){
            Modal.error({
              title: '错误',
              content: '请求参数有误，请确认',
            })
          }
        }
      })
      this.setState(() => ({
        move: true
      }))
    }else{
      Modal.warning({
        title: '警告',
        content: '请先选择图片再进行识别',
      })
    }
  }
  
  // 结果的文本框修改监听
  result1(e){
    const value = e.target.value;
    this.setState(() => ({
      result1:value
    }))
  }
  result2(e){
    const value = e.target.value;
    this.setState(() => ({
      result2:value
    }))
  }

  // 循环list显示图片
  getPic(){
    // eslint-disable-next-line array-callback-return
    return this.state.list.map( item => {
      return (
        <div key={ item } index={ item } className={ this.state.move === false ? (this.state.inputValue === item ? 'dashed' : '') : (this.state.inputValue === item ? 'dashed disabled' : 'disabled')}
         onClick={ this.handlePic.bind(this, item) }>
          <img src={ item } alt=''></img>
        </div>
      )
    })
  }

  // 点击待选区域的图片替换上面的图片
  handlePic(item){
    if(!this.state.move){
      this.setState(() => ({
        inputValue: item
      }))
    }
  }
}

export default OCR