/* ==========================================================================
   Custom JS Interactions
   ========================================================================== */

console.log(
    '%c Hacker OS %c System Online ',
    'background: #05060a; padding: 1px; border-radius: 3px 0 0 3px;  color: #00eaff',
    'background: linear-gradient(90deg, #00eaff, #ff3cac); padding: 1px; border-radius: 0 3px 3px 0;  color: #05060a'
);

// Add any custom interactions here
document.addEventListener('DOMContentLoaded', () => {
    // Example: Add a class to body when scrolled
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    });
});
