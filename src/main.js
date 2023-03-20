import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createMouseTailing } from 'mouse-tailing';

createApp(App).mount('#app');

createMouseTailing({ type: 'sky' });
