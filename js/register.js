
document.addEventListener('DOMContentLoaded', function () {
    const BASE_URL = "https://admindemo.boniantech.com/callprophetsTest";

    const ENDPOINTS = {
        login: "/api/Account/Login",
        register: "/api/Account/RegisterCustomer"

    };

    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const addressInput = document.getElementById('address');
    const genderInput = document.getElementById('gender');
    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const firstNameError = document.getElementById('firstNameError');
    const lastNameError = document.getElementById('lastNameError');
    const addressError = document.getElementById('addressError');
    const genderError = document.getElementById('genderError');
    const serverError = document.getElementById('serverError');

    const successMessage = document.getElementById('successMessage');

    usernameInput.addEventListener('blur', validateUsername);
    emailInput.addEventListener('blur', validateEmail);
    phoneInput.addEventListener('blur', validatePhone);
    passwordInput.addEventListener('blur', validatePassword);
    confirmPasswordInput.addEventListener('blur', validateConfirmPassword);
    firstNameInput.addEventListener('blur', validateFirstName);
    lastNameInput.addEventListener('blur', validateLastName);
    genderInput.addEventListener('blur', validateGender);


    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const isUsernameValid = validateUsername();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isFirstNameValid = validateFirstName();
        const isLastNameValid = validateLastName();
        const isGenderValid = validateGender();

        if ( isUsernameValid && isEmailValid && isPhoneValid &&
            isPasswordValid && isConfirmPasswordValid &&
            isFirstNameValid && isLastNameValid && isGenderValid) {

            const payload = {
                Username: usernameInput.value.trim(),
                Email: emailInput.value.trim(),
                Phone: phoneInput.value.trim(),
                Password: passwordInput.value,
                ConfirmPassword: confirmPasswordInput.value,
                FirstName: firstNameInput.value.trim(),
                LastName: lastNameInput.value.trim(),
                Address: addressInput.value.trim(),
                Gender: genderInput.value,
            };

            const defaultOptions = {
                headers: {
                    "Content-Type": "application/json",
                },
            }

            // if (ENDPOINTS.authToken && !isTokenExpired(ENDPOINTS.authToken)) {
            //     defaultOptions.headers["Authorization"] = `Bearer ${ENDPOINTS.authToken}`
            // }

            fetch(BASE_URL + ENDPOINTS.register, {
                method: 'POST',
                headers: defaultOptions.headers,
                body: JSON.stringify(payload)
            })
                .then(res => res.json())
                .then(response => {
                    if (response.isFail) {
             
                        showFormError(response.message);
                        
                    } else if (response.errors) {
                        handleModelErrors(response.errors);
                    } 
                    else {
                        showSuccess(response.Message || 'Registration successful!');
                        window.location.href = "index.html"; 
                        registerForm.reset();
                    }
                })
                .catch(error => {
                    showFormError('An error occurred. Please try again.');
                });
        }
    });

    function validateUsername() {
        const username = usernameInput.value.trim();

        if (!username) {
            usernameError.textContent = 'Username is required';
            return false;
        } else if (username.length < 3) {
            usernameError.textContent = 'Username must be at least 3 characters';
            return false;
        } else {
            usernameError.textContent = '';
            return true;
        }
    }

    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            emailError.textContent = 'Email is required';
            return false;
        } else if (!emailRegex.test(email)) {
            emailError.textContent = 'Please enter a valid email address';
            return false;
        } else {
            emailError.textContent = '';
            return true;
        }
    }

    function validatePhone() {
        const phone = phoneInput.value.trim();
        const phoneRegex = /^01[0125][0-9]{8}$/;

        if (!phone) {
            phoneError.textContent = 'Phone number is required';
            return false;
        } else if (!phoneRegex.test(phone)) {
            phoneError.textContent = 'Please enter a valid Egyptian phone number ';
            return false;
        } else {
            phoneError.textContent = '';
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

    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!confirmPassword) {
            confirmPasswordError.textContent = 'Please confirm your password';
            return false;
        } else if (password !== confirmPassword) {
            confirmPasswordError.textContent = 'Passwords do not match';
            return false;
        } else {
            confirmPasswordError.textContent = '';
            return true;
        }
    }

    function validateFirstName() {
        const firstName = firstNameInput.value.trim();

        if (!firstName) {
            firstNameError.textContent = 'First name is required';
            return false;
        } else {
            firstNameError.textContent = '';
            return true;
        }
    }

    function validateLastName() {
        const lastName = lastNameInput.value.trim();

        if (!lastName) {
            lastNameError.textContent = 'Last name is required';
            return false;
        } else {
            lastNameError.textContent = '';
            return true;
        }
    }

    function validateGender() {
        const gender = genderInput.value;

        if (!gender) {
            genderError.textContent = 'Gender is required';
            return false;
        } else {
            genderError.textContent = '';
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
        serverError.textContent = message;
    }

    function handleModelErrors(errors) {
        serverError.textContent = '';
        var errorMessages = Object.values(errors);
        errorMessages.forEach(messages => {
            serverError.textContent += messages[0] + '\n';
            
        });
    }

});
