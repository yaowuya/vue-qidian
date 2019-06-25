import { Toast } from 'vant'

export const loading={
  showLoading:function () {
    Toast.loading({
      mask: true,
      message: '加载中...'
    });
  },
  closeLoding:function () {
    Toast.clear();
  }
}
