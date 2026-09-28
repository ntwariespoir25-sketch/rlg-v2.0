@echo off
echo Creating admin folder structure...

:: Create directories
mkdir admin
mkdir admin\components
mkdir admin\pages
mkdir admin\contexts
mkdir admin\services
mkdir admin\utils
mkdir admin\styles

:: Create component files
type nul > admin\components\AdminLayout.jsx
type nul > admin\components\AdminSidebar.jsx
type nul > admin\components\AdminHeader.jsx
type nul > admin\components\StatsCard.jsx
type nul > admin\components\DataTable.jsx
type nul > admin\components\ChartCard.jsx

:: Create page files
type nul > admin\pages\AdminLogin.jsx
type nul > admin\pages\AdminDashboard.jsx
type nul > admin\pages\BlogsManagement.jsx
type nul > admin\pages\ProgramsManagement.jsx
type nul > admin\pages\GalleryManagement.jsx
type nul > admin\pages\EventsManagement.jsx
type nul > admin\pages\ContactsManagement.jsx
type nul > admin\pages\DonationsManagement.jsx
type nul > admin\pages\TestimonialsManagement.jsx
type nul > admin\pages\Settings.jsx

:: Create context file
type nul > admin\contexts\AdminContext.jsx

:: Create service file
type nul > admin\services\adminApi.js

:: Create utility file
type nul > admin\utils\adminHelpers.js

:: Create style file
type nul > admin\styles\admin.css

echo.
echo Admin folder structure created successfully!
pause