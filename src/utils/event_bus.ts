class EventBus {
    // 用于存储事件及其对应的回调函数列表的对象
    private events: { [key: string]: ((data: any) => void)[] } = {};

    // 订阅事件的方法
    on(eventName: string, callback: (data: any) => void) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    // 取消订阅事件的方法
    off(eventName: string, callback: (data: any) => void) {
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter(cb => {
                console.log(cb !== callback)
                return cb !== callback
            });
        }
    }

    offAll(eventName: string) {
        if (this.events[eventName]) {
            this.events[eventName] = [];
        }
    }

    // 触发事件的方法，会遍历并执行该事件对应的所有回调函数
    emit(eventName: string, data?: any) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(callback => callback(data));

        }
    }
}

// 创建一个EventBus实例
const eventBus = new EventBus();
export default eventBus;