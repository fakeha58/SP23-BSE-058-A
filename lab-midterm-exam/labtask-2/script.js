// script.js
document.getElementById('checkoutForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent form submission to validate manually
    
    // Clear previous error messages
    clearErrors();
    
    // Validate fields
    let isValid = true;

    if (!validateFullName()) {
        isValid = false;
    }
    if (!validateEmail()) {
        isValid = false;
    }
    if (!validatePhone()) {
        isValid = false;
    }
    if (!validateAddress()) {
        isValid = false;
    }
    if (!validateCreditCard()) {
        isValid = false;
    }
    if (!validateExpiryDate()) {
        isValid = false;
    }
    if (!validateCVV()) {
        isValid = false;
    }

    if (isValid) {
        alert('Form submitted successfully!');
        document.getElementById('checkoutForm').reset();  // Reset the form
    }
});

function clearErrors() {
    document.querySelectorAll('.error').forEach(error => error.textContent = '');
}

function validateFullName() {
    const fullName = document.getElementById('fullName').value;
    const regex = /^[A-Za-z\s]+$/;
    const errorElement = document.getElementById('fullNameError');
    
    if (!fullName.match(regex)) {
        errorElement.textContent = 'Full Name must only contain alphabets';
        return false;
    }
    return true;
}

function validateEmail() {
    const email = document.getElementById('email').value;
    const errorElement = document.getElementById('emailError');
    
    if (!email) {
        errorElement.textContent = 'Email is required';
        return false;
    }
    return true;
}

function validatePhone() {
    const phone = document.getElementById('phone').value;
    const regex = /^\d{10,15}$/;
    const errorElement = document.getElementById('phoneError');
    
    if (!phone.match(regex)) {
        errorElement.textContent = 'Phone number must be between 10 and 15 digits';
        return false;
    }
    return true;
}

function validateAddress() {
    const address = document.getElementById('address').value;
    const errorElement = document.getElementById('addressError');
    
    if (!address.trim()) {
        errorElement.textContent = 'Address is required';
        return false;
    }
    return true;
}

function validateCreditCard() {
    const creditCard = document.getElementById('creditCard').value;
    const regex = /^\d{16}$/;
    const errorElement = document.getElementById('creditCardError');
    
    if (!creditCard.match(regex)) {
        errorElement.textContent = 'Credit card number must be exactly 16 digits';
        return false;
    }
    return true;
}

function validateExpiryDate() {
    const expiryDate = document.getElementById('expiryDate').value;
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;  // Matches MM/YY format
    const errorElement = document.getElementById('expiryDateError');

    if (!expiryDate.match(regex)) {
        errorElement.textContent = 'Expiry date must be in MM/YY format';
        return false;
    }

    const [month, year] = expiryDate.split('/');
    const expiry = new Date(`20${year}`, month - 1);
    const currentDate = new Date();

    if (expiry <= currentDate) {
        errorElement.textContent = 'Expiry date must be in the future';
        return false;
    }

    return true;
}

function validateCVV() {
    const cvv = document.getElementById('cvv').value;
    const regex = /^\d{3}$/;
    const errorElement = document.getElementById('cvvError');
    
    if (!cvv.match(regex)) {
        errorElement.textContent = 'CVV must be exactly 3 digits';
        return false;
    }
    return true;
}
