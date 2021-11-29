// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Custom styles
import './stylesheets/main.css';

import { Router } from './Domain/Router/Router';
import Navbar from './Domain/Navbar/Navbar';

// This is the entry point to your app : add all relevant import and custom code

Navbar();

Router();