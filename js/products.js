// ESM載入
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';
import pagination from './pagination.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'yuchi-hexschool';

let productModal = {};
let deleteProductModal = {};

// vue
const app = createApp({
    data() {
        return {
            apiUrl: apiUrl,
            apiPath: apiPath,
            products: [],
            isNew: false,
            tempProduct: {
                imagesUrl: []
            },
            pagination: {}
        }
    },
    components: {
        pagination
    },
    methods: {
        checkLogin() {
            const url = `${this.apiUrl}/api/user/check`;
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            axios.defaults.headers.common['Authorization'] = token;

            axios.post(url)
                .then(res => {
                    this.getData()
                })
                .catch(err => {
                    alert(err.data.message);
                    window.location = 'index.html';
                })
        },
        getData(page = 1) {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/?page=${page}`;
            axios.get(url)
                .then(res => {
                    this.products = res.data.products;
                    this.pagination = res.data.pagination;
                    // console.log(page)
                })
        },
        openModal(status, product) {
            if( status === 'isNew' ) {
                
                this.tempProduct = { imagesUrl: [] }; // 初始化
                this.isNew = true;
                productModal.show();

            }else if( status === 'edit' ) {
                
                this.tempProduct = { ...product }; // 產品資料
                this.isNew = false;
                productModal.show();

            }else if( status === 'delete' ) {
                
                this.tempProduct = { ...product }; // 產品資料
                deleteProductModal.show();

            }
        }
    },
    mounted() {
        this.checkLogin();
    }
});

app.component('updateProductModal', {
    data() {
        return {
            apiUrl: apiUrl,
            apiPath: apiPath,
        }
    },
    props: ['tempProduct','isNew'],
    template: `
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header bg-dark text-white">
                <h5 class="modal-title" id="productModalLabel">
                    <div v-if="isNew">新增產品</div>
                    <div v-else>編輯產品</div>
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="productAlbumImg" class="form-label">主要圖片</label>
                                <input type="text" class="form-control mb-3" id="productAlbumImg" v-model="tempProduct.imageUrl" placeholder="輸入圖片網址">
                                <img :src="tempProduct.imageUrl" alt="">
                            </div>

                            <h4>多圖新增</h4>
                            <div v-if="Array.isArray(tempProduct.imagesUrl)">
                                <div v-for="(imgUrl , key) in tempProduct.imagesUrl" :key="key + '12345'">
                                    <input type="text" class="form-control mb-3" v-model="tempProduct.imagesUrl[key]" placeholder="輸入圖片網址">
                                    <img class="mb-3" :src="tempProduct.imagesUrl[key]" alt="">
                                </div>
                                <div class="d-grid gap-2">
                                    <button v-if="!tempProduct.imagesUrl.length || tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1]" 
                                    type="button" class="btn btn-outline-primary btn-sm" @click="tempProduct.imagesUrl.push('')">新增圖片</button>
                                    <button v-else type="button" class="btn btn-outline-danger btn-sm" @click="tempProduct.imagesUrl.pop()">刪除圖片</button>
                                </div>
                            </div>
                            <div v-else>
                                <div class="d-grid">
                                    <button type="button" class="btn btn-outline-primary btn-sm" 
                                    @click="createImages">新增圖片</button>
                                </div>
                            </div>
                            
                        </div>
                        <div class="col-md-8">
                            <div class="mb-3">
                                <label for="productTitle" class="form-label">標題</label>
                                <input type="text" v-model="tempProduct.title" class="form-control" name="productTitle" id="productTitle" placeholder="標題">
                            </div>

                            <div class="row">
                                <div class="mb-3 col-md-6">
                                    <label for="productCategory" class="form-label">分類</label>
                                    <input type="text" v-model="tempProduct.category" class="form-control" name="productCategory" id="productCategory" placeholder="分類">
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label for="productUnit" class="form-label">單位</label>
                                    <input type="text" v-model="tempProduct.unit" class="form-control" name="productUnit" id="productUnit" placeholder="單位">
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label for="productOriginPrice" class="form-label">原價</label>
                                    <input type="number" v-model.number="tempProduct.origin_price" class="form-control" name="productOriginPrice" id="productOriginPrice" placeholder="原價">
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label for="productPrice" class="form-label">售價</label>
                                    <input type="number" v-model.number="tempProduct.price" class="form-control" name="productPrice" id="productPrice" placeholder="售價">
                                </div>
                            </div>

                            <hr>

                            <div class="mb-3">
                                <label for="productDescription" class="form-label">產品描述</label>
                                <textarea class="form-control" v-model="tempProduct.description" name="productDescription" id="productDescription" placeholder="請輸入產品描述"></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="productContent" class="form-label">說明內容</label>
                                <textarea class="form-control" v-model="tempProduct.content" name="productContent" id="productContent" placeholder="請輸入說明內容"></textarea>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" v-model="tempProduct.is_enabled" :true-value="true" :false-value="false" type="checkbox" id="productIsEnabled" >
                                <label class="form-check-label" for="productIsEnabled">
                                是否啟用
                                </label>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                <button type="button" class="btn btn-primary" @click="updateProduct()">確認</button>
            </div>
        </div>
    </div>`,
    methods: {
        updateProduct() {
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let method = 'post';

            if(!this.isNew) {
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                method = 'put';
            }

            axios[method](url, { data: this.tempProduct })
            .then(res => {
                console.log(res)
                this.$emit('get-data');
                productModal.hide()
            })
            .catch(err => {
                console.log(err.data.message);
            })
        },
        createImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        }
    },
    mounted() {
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
        });
    }
})

// 刪除產品
app.component('deleteProductModal', {
    data() {
        return {
            apiUrl: apiUrl,
            apiPath: apiPath,
        }
    },
    props: ['tempProduct'],
    template: `
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header bg-danger text-white">
                <h5 class="modal-title" id="deleteProductModalLabel">刪除產品</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                確認刪除 <span class="fw-bold text-danger">{{ tempProduct.title }}</span> 嗎（刪除後無法恢復）？
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                <button type="button" class="btn btn-danger" @click="deleteProduct()">確認刪除</button>
            </div>
        </div>
    </div>`,
    methods: {
        deleteProduct(){
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            let method = 'delete';

            axios[method](url)
            .then(res => {
                this.$emit('get-data');
                deleteProductModal.hide();
            })
            .catch(err => {
                alert(err.data.message);
            })
        }
    },
    mounted() {
        deleteProductModal = new bootstrap.Modal(document.getElementById('deleteProductModal'), {
            keyboard: false
        });
    }
})

app.mount('#app');