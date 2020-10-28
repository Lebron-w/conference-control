<template>
  <div v-loading="showLode" :element-loading-text="''" element-loading-background="rgba(0, 0, 0, 0.7)"  element-loading-spinner="el-icon-loading">
    <div class="title">
      <span>{{ $t('m.adjust_audio_video') }}</span>
      <span class="close-btn" @click="$emit('close-remote-adjust')">&times;</span>
    </div>
    <nav class="tab">
      <a href="javascript:void(0)" class="tab1" :class="{'tab-active': showTab === 1}" @click="showTab = 1">{{ $t('m.adjust_audio_set') }}</a>
      <a href="javascript:void(0)" class="tab2" :class="{'tab-active': showTab === 2}" @click="showTab = 2">{{ $t('m.adjust_video_set') }}</a>
      <a href="javascript:void(0)" class="tab3" :class="{'tab-active': showTab === 3}" @click="showTab = 3">{{ $t('m.adjust_yuntai_set') }}</a>
    </nav>
    <div v-if="showTab === 1">
      <div class="form-warp">
        <span class="form-left">{{ $t('m.adjust_audio_capDev') }}</span>
        <span class="form-ctx">
          <select v-model="audioinfo.CapDevId" :disabled="!audioinfo.CapDevice || audioinfo.CapDevice.length ===0">
            <option v-for="(item, index) in audioinfo.CapDevice" :key="index" :value="index">{{ item }}</option>
          </select>
        </span>
      </div>
      <div class="form-warp">
        <span class="form-left">{{ $t('m.adjust_audio_playDev') }}</span>
        <span class="form-ctx">
          <select v-model="audioinfo.PlayDevId" :disabled="!audioinfo.PlayDevice || audioinfo.PlayDevice.length ===0">
            <option v-for="(item, index) in audioinfo.PlayDevice" :key="index" :value="index">{{ item }}</option>
          </select>
        </span>
      </div>
      <div class="form-warp">
        <span class="form-left">{{ $t('m.adjust_audio_encoder') }}</span>
        <span class="form-ctx">
          <select v-model="audioinfo.EncoderID">
            <option value="6">24K Codec</option>
            <option value="7">32K Codec</option>
          </select>
        </span>
      </div>
      <div class="form-warp form-check-warp">
        <span class="form-left"></span>
        <span class="form-ctx">
          <input type="checkbox" v-model="audioinfo.CapVolumeAutoAdjust">
          <span>{{ $t('m.adjust_audio_capVolumeAutoAdjust') }}</span>
        </span>
      </div>
      <div class="form-warp form-check-warp">
        <span class="form-left"></span>
        <span class="form-ctx">
          <span class="right-spacing">
            <input type="checkbox" v-model="audioinfo.AEC">
            <span>{{ $t('m.adjust_audio_AEC') }}</span>
          </span>
          <span>
            <input type="checkbox" v-model="audioinfo.ANS">
          <span>{{ $t('m.adjust_audio_ANS') }}</span>
          </span>
        </span>
      </div>
      <div class="form-warp form-check-warp">
        <span class="form-left"></span>
        <span class="form-ctx">
          <span class="right-spacing">
            <input type="checkbox" v-model="audioinfo.AGC">
            <span>{{ $t('m.adjust_audio_AGC') }}</span>
          </span>
          <span>
            <input type="checkbox" v-model="audioinfo.VAD">
            <span>{{ $t('m.adjust_audio_VAD') }}</span>
          </span>
        </span>
      </div>
      <div class="form-warp setting-voice">
        <span class="form-left"></span>
        <span class="form-ctx">{{ $t('m.adjust_audio_playVolume') }}</span>
      </div>
      <div class="form-warp form-check-warp">
        <span class="form-left"></span>
        <span class="form-ctx">
          <img src="../../../static/images/attendee/icon_audio.png" alt="">
          <el-slider class="slider slider-width" v-model="audioinfo.PlayVolume"></el-slider>
        </span>
      </div>
      <div class="form-warp setting-voice form-check-warp">
        <span class="form-left"></span>
        <span class="form-ctx">{{ $t('m.adjust_audio_capVolume') }}</span>
      </div>
      <div class="form-warp form-check-warp">
        <span class="form-left"></span>
        <span class="form-ctx">
          <img src="../../../static/images/attendee/icon_microphone _solid.png" alt="">
          <el-slider class="slider slider-width" v-model="audioinfo.CapVolume"></el-slider>
        </span>
      </div>
      <nav class="tab control-btns">
        <a href="javascript:void(0)" class="tab-btn tab1" @click="setAudio(0)">{{ $t('m.common_btn_save') }}</a>
        <a href="javascript:void(0)" class="tab-btn tab2" @click="$emit('close-remote-adjust')">{{ $t('m.common_btn_cancel') }}</a>
        <a href="javascript:void(0)" class="tab-btn tab3 app-btn" @click="setAudio(1)">{{ $t('m.common_btn_app') }}</a>
      </nav>
    </div>
    <div v-if="showTab === 2">
      <div class="form-warp">
        <span class="form-left">{{ $t('m.adjust_video_capDevice') }}</span>
        <span class="form-ctx">
          <select v-model="videoIndex" :disabled="!videoinfo.DeviceList || videoinfo.DeviceList.length ===0">
            <option v-for="(item, index) in videoinfo.DeviceList" :key="index" :value="index">{{ item.CapDevice }}</option>
          </select>
          <input class="defCamera" type="checkbox" v-model="videoModel.DefCamera">
          <span>{{ $t('m.adjust_video_defCamera') }}</span>
        </span>
      </div>
      <div class="form-warp">
        <span class="form-left">{{ $t('m.adjust_video_resolution') }}</span>
        <span class="form-ctx">
          <select v-model="videoModel.Width" @change="setResolution">
            <option v-for="(item, index) in videoWidthFilter" :key="index" :value="item.width">{{ item.widthHeight }}</option>
          </select>
        </span>
      </div>
      <div class="form-warp">
        <span class="form-left">{{ $t('m.adjust_video_input') }}</span>
        <span class="form-ctx">
          <select v-model="videoModel.VideoInput" :disabled="!videoModel.VideoInputList || videoModel.VideoInputList.length ===0">
            <option v-for="(item, index) in videoModel.VideoInputList" :key="index" :value="index">{{ item }}</option>
          </select>
        </span>
      </div>
      <div class="form-warp">
        <span class="form-left">{{ $t('m.adjust_video_encoder') }}</span>
        <span class="form-ctx">
          <select v-model="videoModel.EncoderID">
            <option value="2">MPEG4 PRO</option>
            <option value="3">H264 PRO</option>
          </select>
        </span>
      </div>
      <div class="form-warp setting-voice">
        <span class="form-left"></span>
        <span class="form-ctx">{{ $t('m.adjust_video_frameRate') }}</span>
      </div>
      <div class="form-warp form-check-warp">
        <span class="form-left"></span>
        <span class="form-ctx">
          <img src="../../../static/images/attendee/icon_rate.png" alt="">
          <el-slider class="slider slider-width2" v-model="videoModel.FrameRate" :min="1" :max="30" @change="calcBitrate"></el-slider>
          <span class="unit"><label v-text="videoModel.FrameRate"></label>{{ $t('m.adjust_video_framePerSecond') }}</span>
        </span>
      </div>
      <div class="form-warp setting-voice form-check-warp">
        <span class="form-left"></span>
        <span class="form-ctx">{{ $t('m.adjust_video_bitrate') }}</span>
      </div>
      <div class="form-warp form-check-warp">
        <span class="form-left"></span>
        <span class="form-ctx">
          <img src="../../../static/images/attendee/icon_videostreaming.png" alt="">
          <el-slider class="slider slider-width2" v-model="bitrate" @change="bitrateEvent" :min="10" :max="3000"></el-slider>
          <span class="unit"><label v-text="bitrate" ></label>kbps</span>
        </span>
      </div>
      <div class="form-warp form-check-warp">
        <span class="form-left"></span>
        <span class="form-ctx">
          <span class="right-spacing">
            <input type="checkbox" v-model="videoModel.EncoderMode">
            <span>{{ $t('m.adjust_video_lobkBitrate') }}</span>
          </span>
          <span>
            <input type="checkbox" v-model="videoModel.ShowSysTime">
            <span>{{ $t('m.adjust_video_showSysTime') }}</span>
          </span>
        </span>
      </div>
      <div class="form-warp form-check-warp">
        <span class="form-left"></span>
        <span class="form-ctx">
          <span class="right-spacing">
            <input type="checkbox" v-model="videoModel.VSlip">
            <span>{{ $t('m.adjust_video_VSlip') }}</span>
          </span>
          <span>
            <input type="checkbox" v-model="videoModel.Denoise">
            <span>{{ $t('m.adjust_video_denoise') }}</span>
          </span>
        </span>
      </div>
      <nav class="tab control-btns">
        <a href="javascript:void(0)" class="tab-btn tab1" @click="setVideo(0)">{{ $t('m.common_btn_save') }}</a>
        <a href="javascript:void(0)" class="tab-btn tab2" @click="$emit('close-remote-adjust')">{{ $t('m.common_btn_cancel') }}</a>
        <a href="javascript:void(0)" class="tab-btn tab3 app-btn" @click="setVideo(1)">{{ $t('m.common_btn_app') }}</a>
      </nav>
    </div>
    <div v-if="showTab === 3">
      <div class="fixed-height">
        <div class="form-warp">
          <span class="form-left">{{ $t('m.adjust_yuntai_capDev') }}</span>
          <span class="form-ctx">
            <select v-model="yuntaiinfoIndex" :disabled="!yuntaiinfo.ParamList || yuntaiinfo.ParamList.length ===0">
              <option v-for="(item, index) in yuntaiinfo.ParamList" :key="index" :value="index">{{ item.Name }}</option>
            </select>
          </span>
        </div>
        <div class="form-warp">
          <span class="form-left">{{ $t('m.adjust_yuntai_type') }}</span>
          <span class="form-ctx">
            <select v-model="yuntaiinfoModel.Type">
              <option value="0">VISCA</option>
              <option value="1">RC20</option>
              <option value="2">SU_320</option>
              <option value="3">7AC</option>
              <option value="4">VIDEOTREC_PWT</option>
              <option value="5">PELCO_D</option>
              <option value="6">VC_C50i</option>
              <option value="7">PELCO_P</option>
              <option value="8">UVCXU</option>
            </select>
          </span>
        </div>
        <div class="form-warp">
          <span class="form-left">{{ $t('m.adjust_yuntai_port') }}</span>
          <span class="form-ctx">
            <select v-model="yuntaiinfoModel.Port">
              <option value="0">COM 1:</option>
              <option value="1">COM 2:</option>
              <option value="2">COM 3:</option>
              <option value="3">COM 4:</option>
              <option value="4">COM 5:</option>
              <option value="5">COM 6:</option>
            </select>
          </span>
        </div>
        <div class="form-warp">
          <span class="form-left">{{ $t('m.adjust_yuntai_baudRate') }}</span>
          <span class="form-ctx">
            <select v-model="yuntaiinfoModel.BaudRate">
              <option value="75">75</option>
              <option value="110">110</option>
              <option value="134">134</option>
              <option value="150">150</option>
              <option value="300">300</option>
              <option value="600">600</option>
              <option value="1200">1200</option>
              <option value="1800">1800</option>
              <option value="2400">2400</option>
              <option value="4800">4800</option>
              <option value="7200">7200</option>
              <option value="9600">9600</option>
              <option value="14400">14400</option>
              <option value="19200">19200</option>
              <option value="38400">38400</option>
              <option value="57600">57600</option>
              <option value="115200">115200</option>
              <option value="128000">128000</option>
            </select>
          </span>
        </div>
        <div class="form-warp">
          <span class="form-left">{{ $t('m.adjust_yuntai_addrCode') }}</span>
          <span class="form-ctx">
            <input type="text" v-model="yuntaiinfoModel.AddrCode">
          </span>
        </div>
      </div>
      <nav class="tab control-btns">
        <a href="javascript:void(0)" class="tab-btn tab1" @click="setYuntai(0)">{{ $t('m.common_btn_save') }}</a>
        <a href="javascript:void(0)" class="tab-btn tab2" @click="$emit('close-remote-adjust')">{{ $t('m.common_btn_cancel') }}</a>
        <a href="javascript:void(0)" class="tab-btn tab3 app-btn" @click="setYuntai(1)">{{ $t('m.common_btn_app') }}</a>
      </nav>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: ['userId'], // 接受来自父组件的数据
  data () { // 声明属性
    return {
      videoIndex: 0,
      videoModel: {},
      yuntaiinfoIndex: 0,
      showTab: 1,
      showLode: true
    }
  },
  computed: { // 计算属性
    ...mapState({
      audioinfo: state => state.ws.audioinfo,
      videoinfo: state => state.ws.videoinfo,
      yuntaiinfo: state => state.ws.yuntaiinfo
    }),
    bitrate: {
      set (val) {
        this.videoModel.Bitrate = val
      },
      get () {
        return this.videoModel.Bitrate
      }
    },
    yuntaiinfoModel () {
      return this.yuntaiinfo.ParamList[this.yuntaiinfoIndex]
    },
    videoWidthFilter () { // 根据最大视频宽度过滤显示的视频分辨率
      return [{width: 160, height: 120, widthHeight: '160 * 120'}, {width: 176, height: 144, widthHeight: '176 * 144'}, {width: 320, height: 240, widthHeight: '320 * 240'}, {width: 352, height: 288, widthHeight: '352 * 288'}, {width: 640, height: 480, widthHeight: '640 * 480'}, {width: 704, height: 576, widthHeight: '704 * 576'}, {width: 720, height: 576, widthHeight: '720 * 576'}, {width: 1280, height: 720, widthHeight: '1280 * 720'}, {width: 1920, height: 1080, widthHeight: '1920 * 1080'}].filter(item => {
        return item.width <= this.videoinfo.MaxVideoWidth
      })
    }
  },
  created () { // 在模板渲染成html前调用
    this.getAudio()
    this.getVideo()
    this.getYuntai()
  },
  methods: { // 声明方法
    // 设置分辨率的宽和高，并计算视频码流
    setResolution () {
      const that = this
      this.videoWidthFilter.forEach(function (obj) {
        if (obj.width === that.videoModel.Width) {
          that.videoModel.Heigth = obj.height
        }
      })
      this.calcBitrate()
    },
    // 根据视频分辨率和帧速率计算出默认视频码流
    calcBitrate () {
      this.videoModel.Bitrate = Math.floor((Math.pow(2, Math.log((this.videoModel.Width * this.videoModel.Heigth) / (320 * 240)) / Math.log(3)) * 10000 * this.videoModel.FrameRate) / 1000)
      this.bitrateEvent()
    },
    bitrateEvent () {
      // 高于512K，自动选上锁定视频码流，低于则不选
      if (this.bitrate >= 512) {
        this.videoModel.EncoderMode = 1
      } else {
        this.videoModel.EncoderMode = 0
      }
    },
    getAudio () {
      // 获取音频信息
      let msg = {
        'CmdID': 1009,
        'Data': {
          'UserID': this.userId
        }
      }
      this.$ws.send(msg)
    },
    getVideo () {
      // 获取视频信息
      let msg = {
        'CmdID': 1010,
        'Data': {
          'UserID': this.userId
        }
      }
      this.$ws.send(msg)
    },
    getYuntai () {
      // 获取云台信息
      let msg = {
        'CmdID': 1011,
        'Data': {
          'UserID': this.userId
        }
      }
      this.$ws.send(msg)
    },
    setVideoModel (index) { // 初始化视频参数
      this.videoModel = this.videoinfo.DeviceList[index]
      this.videoModel.ShowSysTime = parseInt(this.videoModel.ShowSysTime)
      this.videoModel.DefCamera = parseInt(this.videoModel.DefCamera)
      this.videoModel.EncoderMode = (this.videoModel.EncoderMode === 1 ? 1 : 0)
      if (this.videoModel.Bitrate >= 10 * 1000) {
        this.videoModel.Bitrate = this.videoModel.Bitrate / 1000
      }
    },
    setAudio (isClose) {
      // Web端请求设置某个用户音频参数
      let msg = {
        'CmdID': 1012,
        'Data': {
          // 用户ID
          'UserID': this.userId,
          // 采集设备索引号
          'CapDevId': this.audioinfo.CapDevId,
          // 播放设备索引号
          'PlayDevId': this.audioinfo.PlayDevId,
          // 线路输入接口
          'CapInput': this.audioinfo.CapInput,
          // 采集音量
          'CapVolume': this.audioinfo.CapVolume,
          // 播放音量
          'PlayVolume': this.audioinfo.PlayVolume,
          // 采集音量自动调节
          'CapVolumeAutoAdjust': Number(this.audioinfo.CapVolumeAutoAdjust),
          // 音频编码器ID
          'EncoderID': parseInt(this.audioinfo.EncoderID),
          // 回声消除
          'AEC': Number(this.audioinfo.AEC),
          // 音频降噪
          'ANS': Number(this.audioinfo.ANS),
          // 向前纠错
          'FEC': this.audioinfo.FEC,
          // 语音增益
          'AGC': Number(this.audioinfo.AGC),
          // 静音检测
          'VAD': Number(this.audioinfo.VAD),
          // 固定打开音频参数自动调节
          'AutoAdjust': this.audioinfo.AutoAdjust,
          // 启用音频兼容模式
          'AudioEngin': this.audioinfo.AudioEngin,
          // 当前使用的音频采集设备名 4u only
          'LastCapDev': this.audioinfo.CapDevice[this.audioinfo.CapDevId],
          // 当前使用的音频播放设备名 4u only
          'LastPlayDev': this.audioinfo.PlayDevice[this.audioinfo.PlayDevId]
        }
      }
      this.$ws.send(msg)
      if (isClose === 0) {
        this.$emit('close-remote-adjust')
      }
    },
    setVideo (isClose) {
      // Web端请求设置某个用户视频参数
      let msg = {
        'CmdID': 1013,
        'Data': {
          // 用户ID
          'UserID': this.userId,
          // 视频压缩器ID
          'EncoderID': parseInt(this.videoModel.EncoderID),
          // 视频压缩模式定义
          'EncoderMode': Number(this.videoModel.EncoderMode) === 1 ? 1 : 2,
          // 帧率
          'FrameRate': this.videoModel.FrameRate,
          // 质量
          'VBRQuality': this.videoModel.VBRQuality,
          // 码率
          'Bitrate': this.bitrate * 1000,
          // 关键帧间隔
          'KeyFrameInterval': this.videoModel.KeyFrameInterval,
          // 视频采集设备索引号
          'CapDevId': this.videoIndex,
          // 视频宽度
          'Width': parseInt(this.videoModel.Width),
          // 视频高度
          'Heigth': this.videoModel.Heigth,
          // 视频输入端子类型
          'VideoInput': parseInt(this.videoModel.VideoInput),
          // 视频制式
          'VideoStandand': this.videoModel.VideoStandand,
          // 自动参数调节
          'AutoAdjust': this.videoModel.AutoAdjust,
          // 视频降噪
          'Denoise': Number(this.videoModel.Denoise),
          // 视频上下翻转
          'VSlip': Number(this.videoModel.VSlip),
          // 默认设备
          'DefCamera': isNaN(this.videoModel.DefCamera) ? '0' : Number(this.videoModel.DefCamera).toString(),
          // 视频上显示系统时间
          'ShowSysTime': Number(this.videoModel.ShowSysTime).toString(),
          // 视频上显示用户名
          'ShowUserName': this.videoModel.ShowUserName,
          // 打开QOS
          'EnableQos': this.videoinfo.EnableQos,
          // 视频模式 0,// 平衡模式 1, // 流畅优先 2,// 清晰优先 3 // 自定义
          'VideoModal': this.videoModel.VideoModal
        }
      }
      this.$ws.send(msg)
      if (isClose === 0) {
        this.$emit('close-remote-adjust')
      }
    },
    setYuntai (isClose) {
      var reg = /^[0-9]{1,}$/
      if (this.yuntaiinfoModel.AddrCode !== '' && !reg.test(this.yuntaiinfoModel.AddrCode)) {
        alert(this.$t('m.adjust_yuntai_msg_addrCodeError'))
        return
      }

      // Web端请求设置某个用户云台参数
      let msg = {
        'CmdID': 1014,
        'Data': {
          // 用户ID
          'UserID': this.userId,
          // 设备名
          'Name': this.yuntaiinfoModel.Name,
          //
          'MediaID': this.yuntaiinfoModel.MediaID,
          //
          'DevIndex': this.yuntaiinfoModel.DevIndex,
          // 云台类型
          'Type': parseInt(this.yuntaiinfoModel.Type),
          // 控制端口
          'Port': parseInt(this.yuntaiinfoModel.Port),
          // 波特率
          'BaudRate': parseInt(this.yuntaiinfoModel.BaudRate),
          // 地址码
          'AddrCode': this.yuntaiinfoModel.AddrCode === '' ? 0 : parseInt(this.yuntaiinfoModel.AddrCode)
        }
      }
      this.$ws.send(msg)
      if (isClose === 0) {
        this.$emit('close-remote-adjust')
      }
    }
  },
  watch: { // 监听属性
    videoIndex (newVal) {
      this.setVideoModel(newVal)
    },
    audioinfo: {
      handler (audioinfo) {
        if (audioinfo.UserID > 0) {
          // 取消loading
          this.showLode = false
        }
      },
      immediate: true
    },
    videoinfo: {
      handler (videoinfo) {
        if (videoinfo.UserID > 0) {
          this.setVideoModel(0)
        }
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  box-sizing: border-box;
  width: 100%;
  height: 48px;
  border-bottom: 1px solid #EAECEE;
  line-height: 48px;
  font: {
    size: 16px;
    weight: bold;
  }
  color: #323232;
  text-align: justify;
  span {
    display: inline-block;
    &:not(.close-btn) {
      width: calc(100% - 32px);
      text-indent: 20px;
    }
    &.close-btn {
      width: 26px;
      font-size: 22px;
    }
  }
}
.tab-active {
  background-color: #2997da;
  color: #fff !important;
}
.tab, .control-btns {
  width: 300px;
  font-size: 0;
  margin: 30px auto 20px;
  a {
    text-decoration: none;
    display: inline-block;
    box-sizing: border-box;
    width: 100px;
    height: 30px;
    border: 1px solid #dfe3e7;
    &:nth-of-type(n+2) {
      border-left: none;
    }
    font-size: 12px;
    font-weight: bold;
    color: #323232;
    text-align: center;
    line-height: 30px;
    border-radius: 2px;
  }
  .app-btn {
    background-color: #2997DA;
    color: #fff;
  }
  &.control-btns {
    margin-top: 20px;
  }
  a.tab-btn {
    font-size: 12px;
    text-align: center;
    display: inline-block;
    box-sizing: border-box;
    width: 90px;
    margin-left: 15px;
    border: 1px solid #dfe3e7;
    &:first-child {
      margin-left: 0;
    }
  }
}

.form-warp {
  box-sizing: border-box;
  font-size: 0;
  color: #323232;
  width: 100%;
  height: 30px;
  line-height: 30px;
  // padding: 5px 0;
  margin-top: 10px;
  .form-left {
    display: inline-block;
    width: 23.2%;
    font-size: 12px;
    text-align: right;
  }
  .form-ctx {
    display: inline-block;
    width: 76.8%;
    font-size: 12px;
    text-indent: 10px;
    position: relative;
    .unit{
      display: inline-block;
      position: absolute;
      top: -5px;
      right: 149px;
    }
    .defCamera {
      margin-left: 10px !important;
      margin-right: 6px !important;
    }
  }
  &:nth-of-type(4) {
    margin-top: 14px;
  }
}

.setting-voice {
  margin-top: 10px;
}

.form-check-warp {
  margin-top: 8px;
}

.fixed-height {
  height: 384px;
}

select,input[type=text] {
  height: 30px;
  width: 300px;
  border: 1px solid #DFE3E7;
  box-sizing: border-box;
  padding-left: 8px;
}

input[type=checkbox]{
  -webkit-appearance: none;  /*清除复选框默认样式*/
  width: 16px;
  height: 16px;
  vertical-align:middle;
  box-sizing: border-box;
  margin-right: 10px;
  background: url('../../assets/common-icon/checkbox_white.png');
  &:checked {
    background: url('../../assets/common-icon/checkbox_focus_green.png') no-repeat;
  }
  &:hover{
    box-shadow: 0px 0px 2px 2px rgb(63, 176, 114);
    cursor: pointer;
  }
}

.right-spacing {
  display: inline-block;
  width: 204px;
  margin-left: -10px;
}

.slider {
  display: inline-block;
  position: absolute;
  top: -8px;
  left: 40px;
}

.slider-width {
  width: 240px;
}

.slider-width2 {
  width: 204px;
}
</style>
