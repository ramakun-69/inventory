import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import 'react-quill-new/dist/quill.snow.css';
import "jsvectormap/dist/css/jsvectormap.css";
import 'react-toastify/dist/ReactToastify.css';
import 'react-modal-video/css/modal-video.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './csrf.js'
import './i18n.js'
import '../css/datatable.css';

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
        return pages[`./Pages/${name}.jsx`]
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <App {...props} />
        )
    },
    progress: {
        color: '#496cedff'
    },
})