// ESM載入
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

createApp({
    data() {
        return {
            user: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        login() {
            const url = 'https://vue3-course-api.hexschool.io/v2/admin/signin';

            axios.post(url, this.user)
                // 成功
                .then((res) => {
                    // console.log(res)
                    const { token, expired } = res.data;
                    // console.log(token, expired)
                    document.cookie = `hexToken=${ token }; expires=${ new Date(expired) }; path=/`;
                    window.location = 'products.html';
                })
                // 失敗
                .catch((err) => {
                    alert(err.data.message);
                })
        }
    },
}).mount('#app');