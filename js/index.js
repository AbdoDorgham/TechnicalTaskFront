document.addEventListener('DOMContentLoaded', function () {
    const BASE_URL = "https://admindemo.boniantech.com/callprophetsTest";

    const ENDPOINTS = {
        login: "/api/Account/Login",
        register: "/api/Account/RegisterCustomer"

    };

    const loginForm = document.getElementById('loginForm');
    const userNameInput = document.getElementById('userName');
    const passwordInput = document.getElementById('password');
    const userNameError = document.getElementById('userNameError');
    const passwordError = document.getElementById('passwordError');
    const successMessage = document.getElementById('successMessage');

    userNameInput.addEventListener('blur', function () {
        validateuserName();
    });

    passwordInput.addEventListener('blur', function () {
        validatePassword();
    });

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const isuserNameValid = validateuserName();
        const isPasswordValid = validatePassword();

        if (isuserNameValid && isPasswordValid) {
            const payload = {
                UserNameOrEmail: userNameInput.value.trim(),
                Password: passwordInput.value
            };
            fetch(BASE_URL + ENDPOINTS.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(res => res.json())
                .then(response => {

                    if(response.isFail){ 
                            showFormError(response.message);
                            
                    } else {
                        showSuccess(response.message || 'Login successful!');
                        localStorage.setItem('authToken', response.returnedObj);
                        loginForm.reset();
                        window.location.href = 'orders.html'; 
                    }
                })
                .catch(error => {
                    showFormError('An error occurred. Please try again.');
                });
        }
    });

    function validateuserName() {
        const userName = userNameInput.value.trim();
        if (!userName) {
            userNameError.textContent = 'UserName is required';
            return false;
        } else {
            userNameError.textContent = '';
            return true;
        }
    }

    function validatePassword() {
        const password = passwordInput.value;
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()[\]{}\-_+=~`|:;'"<>,./?])(?=.*[a-z])(?=.*[A-Z]).{8,}$/

        if (!password) {
            passwordError.textContent = 'Password is required';
            return false;
        } else if (!passwordRegex.test(password)) {
            passwordError.textContent = 'Password must be at least 8 characters, include uppercase and lowercase letters,a special character.';
            return false;
        } else {
            passwordError.textContent = '';
            return true;
        }
    }

    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.classList.remove('hidden');

        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 5000);
    }

    function showFormError(message) {
        passwordError.textContent = message;
    }

});
