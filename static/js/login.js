// ========================================
// LOGIN.JS - Login & Signup Logic
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginFormSubmit = document.getElementById('loginFormSubmit');
    const signupFormSubmit = document.getElementById('signupFormSubmit');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');

    // ===== THEME =====
    function toggleTheme() {
        const isDark = !document.body.classList.contains('light-theme');
        document.body.classList.toggle('light-theme', !isDark);
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    }

    function loadTheme() {
        const saved = localStorage.getItem('theme');
        if (saved === 'light') {
            document.body.classList.add('light-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    themeToggle.addEventListener('click', toggleTheme);

    // ===== TABS =====
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            document.querySelectorAll('.login-form').forEach(f => f.classList.remove('active'));

            if (this.dataset.tab === 'login') {
                loginForm.classList.add('active');
            } else {
                signupForm.classList.add('active');
            }

            clearErrors();
        });
    });

    // ===== TOGGLE PASSWORD =====
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const input = this.closest('.password-input').querySelector('input');
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // ===== LOGIN =====
    loginFormSubmit.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail');
        const password = document.getElementById('loginPassword');
        const remember = document.getElementById('rememberMe');

        clearErrors([email, password]);

        let isValid = true;

        if (!email.value.trim()) {
            showError(email, 'Please enter your email');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        if (!password.value) {
            showError(password, 'Please enter your password');
            isValid = false;
        } else if (password.value.length < 6) {
            showError(password, 'Password must be at least 6 characters');
            isValid = false;
        }

        if (!isValid) return;

        const btn = document.getElementById('loginSubmitBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';

        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';

            const userData = {
                name: email.value.split('@')[0],
                email: email.value,
                avatar: null,
            };

            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('userName', userData.name);
            localStorage.setItem('userEmail', userData.email);
            
            if (remember.checked) {
                localStorage.setItem('rememberMe', 'true');
            }

            showToast('🎉 Welcome back!', 'success');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }, 1000);
    });

    // ===== SIGNUP =====
    signupFormSubmit.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('signupName');
        const email = document.getElementById('signupEmail');
        const password = document.getElementById('signupPassword');
        const confirm = document.getElementById('signupConfirm');
        const terms = document.getElementById('termsCheck');

        clearErrors([name, email, password, confirm]);

        let isValid = true;

        if (!name.value.trim()) {
            showError(name, 'Please enter your full name');
            isValid = false;
        } else if (name.value.trim().length < 2) {
            showError(name, 'Name must be at least 2 characters');
            isValid = false;
        }

        if (!email.value.trim()) {
            showError(email, 'Please enter your email');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        if (!password.value) {
            showError(password, 'Please create a password');
            isValid = false;
        } else if (password.value.length < 6) {
            showError(password, 'Password must be at least 6 characters');
            isValid = false;
        }

        if (!confirm.value) {
            showError(confirm, 'Please confirm your password');
            isValid = false;
        } else if (password.value !== confirm.value) {
            showError(confirm, 'Passwords do not match');
            isValid = false;
        }

        if (!terms.checked) {
            showToast('Please agree to the Terms of Service', 'error');
            isValid = false;
        }

        if (!isValid) return;

        const btn = document.getElementById('signupSubmitBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';

        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';

            const userData = {
                name: name.value.trim(),
                email: email.value,
                avatar: null,
            };

            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('userName', userData.name);
            localStorage.setItem('userEmail', userData.email);

            showToast('🎉 Account created successfully!', 'success');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }, 1200);
    });

    // ===== HELPERS =====
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(input, message) {
        input.classList.add('error');
        input.classList.remove('success');
        
        let error = input.parentElement.querySelector('.form-error');
        if (!error) {
            error = document.createElement('div');
            error.className = 'form-error';
            input.parentElement.appendChild(error);
        }
        error.textContent = message;
        error.classList.add('show');
    }

    function clearErrors(inputs) {
        if (inputs) {
            inputs.forEach(input => {
                if (input) {
                    input.classList.remove('error', 'success');
                    const error = input.parentElement.querySelector('.form-error');
                    if (error) {
                        error.classList.remove('show');
                    }
                }
            });
        } else {
            document.querySelectorAll('.form-group input').forEach(input => {
                input.classList.remove('error', 'success');
                const error = input.parentElement.querySelector('.form-error');
                if (error) {
                    error.classList.remove('show');
                }
            });
        }
    }

    // ===== TOAST =====
    let toastTimeout;

    function showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        if (!toast) {
            alert(message);
            return;
        }

        toast.textContent = message;
        toast.className = 'toast';
        toast.classList.add(type);

        void toast.offsetWidth;
        toast.classList.add('show');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // ===== INIT =====
    loadTheme();

    // Check if already logged in
    if (localStorage.getItem('userData')) {
        window.location.href = 'index.html';
    }
});