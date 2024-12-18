
<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-8 offset-md-2">
                <h1 class="text-center">Welcome to Elden Home!</h1>
                <form @submit.prevent="submitForm">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="username" class="form-label">Username</label>
                            <input type="text" class="form-control" id="username" 
                             @blur="() => validateName(true)"
                             @input="() => validateName(false)"
                            v-model="formData.username">
                            <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
                        </div>
                        <div class="col-md-6">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control" id="password" 
                            @blur="() => validatePassword(true)"
                            @input="()=>validatePassword(false)"
                            v-model="formData.password">
                            <small v-if="errors.password" class="text-danger">{{ errors.password }}</small>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="confirm-password" class="form-label">Confirm Password</label>
                            <input type="password" class="form-control" id="confirm-password"
                             v-model="formData.confirmPassword"
                             @blur="() => validateConfirmPassword(true)">
                            <small v-if="errors.confirmPassword" class="text-danger">{{ errors.confirmPassword }}</small>
                        </div>
                    </div>
                    <div class="row mb-3">
                    <div class="col-md-6 d-flex align-items-center">
                        <div class="form-check me-3">
                            <input type="checkbox" class="form-check-input" id="isAustralian" 
                            v-model="formData.isAustralian" @change="validateResident">
                            <label class="form-check-label" for="isAustralian">Australian Resident?</label>
                            <small v-if="errors.isAustralian" class="text-danger d-block mt-1">{{ errors.isAustralian }}</small>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="isAdmin" v-model="formData.isAdmin">
                            <label class="form-check-label" for="isAdmin">Register as Admin?</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label for="gender" class="form-label">Gender</label>
                        <select class="form-select" id="gender" 
                        v-model="formData.gender" @change="validateGender">
                            <option value="" disabled>Select your gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        <small v-if="errors.gender" class="text-danger mt-1">{{ errors.gender }}</small>
                    </div>
                </div>


                        <div class="mb-3">
                        <label for="reason" class="form-label">Reason for joining</label>
                        <textarea class="form-control" id="reason" rows="3" 
                        v-model="formData.reason" @blur="validateReason" @input="validateReason"></textarea>
                        <small v-if="errors.reason" class="text-danger">{{ errors.reason }}</small>
                        <small v-if="friendMessage" class="text-success">{{ friendMessage }}</small>
                        </div>

                    
                    <div class="text-center">
                        <button type="submit" class="btn btn-primary me-2">Submit</button>
                        <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
                    </div>
                </form>
                
            </div>
        </div>

        <div v-if="submittedCards.length" class="mt-5">
            <DataTable :value="submittedCards">
                <Column field="username" header="Username"></Column>
                <Column field="password" header="Password"></Column>
                <Column field="isAustralian" header="Australian Resident?" :body="isAustralianColumn"></Column>
                <Column field="gender" header="Gender"></Column>
                <Column field="reason" header="Reason"></Column>
            </DataTable>
        </div>
    </div>
</template>



<script setup>
import { ref } from 'vue';

const formData = ref({
    username: '',
    password: '',
    confirmPassword: '',
    isAustralian: false,
    reason: '',
    gender: '',
    isAdmin: false 
});


const submittedCards = ref([]);

const submitForm =()=>{
    validateName(true);
    validatePassword(true);
    validateConfirmPassword(true); 
    validateResident();
    validateGender();
    validateReason();

    if (!errors.value.username && !errors.value.password && !errors.value.confirmPassword && !errors.value.isAustralian && !errors.value.gender && !errors.value.reason) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({ ...formData.value });
        localStorage.setItem('users', JSON.stringify(users));
        
        submittedCards.value.push({ ...formData.value });
        clearForm();
    }
};

const errors = ref({
    username: null,
    password: null,
    confirmPassword:null,
    isAustralian: null,
    gender: null,
    reason: null,
});

const friendMessage = ref('');
const validateReason = () => {
    const reason = formData.value.reason.trim();
    
    if (reason.length === 0) {
        errors.value.reason = "Please provide a reason for joining.";
        friendMessage.value = '';
    } else {
        errors.value.reason = null;
        
        // Check if the reason contains the word "friend"
        if (reason.toLowerCase().includes('friend')) {
            friendMessage.value = "Great to have a friend!";
        } else {
            friendMessage.value = '';
        }
    }
};

const validateName = (blur) => {
    if (formData.value.username.length < 3) {
        if (blur) errors.value.username = "Name must be at least 3 characters";
    } else {
        errors.value.username = null;
    }
};

const validatePassword = (blur) => {
    const password = formData.value.password;
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        if (blur) errors.value.password = "Password must be at least ${minLength} characters long.";
    } else if (!hasUppercase) {
        if (blur) errors.value.password = "Password must contain at least one uppercase letter.";
    } else if (!hasLowercase) {
        if (blur) errors.value.password = "Password must contain at least one lowercase letter.";
    } else if (!hasNumber) {
        if (blur) errors.value.password = "Password must contain at least one number.";
    } else if (!hasSpecialChar) {
        if (blur) errors.value.password = "Password must contain at least one special character.";
    } else {
        errors.value.password = null;
    }
};

const validateResident = () => {
    if (!formData.value.isAustralian) {
        errors.value.isAustralian = "Please confirm your Australian residency.";
    } else {
        errors.value.isAustralian = null;
    }
};


const validateGender = () => {
    if (!formData.value.gender) {
        errors.value.gender = "Please select a gender.";
    } else {
        errors.value.gender = null;
    }
};



const clearForm = () => {
    formData.value = {
        username: '',
        password: '',
        confirmPassword: '', 
        isAustralian: false,
        reason: '',
        gender: ''
    };
};

const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match.';
  } else {
    errors.value.confirmPassword = null;
  }
};

</script>

<style scoped>
   .card {
   border: 1px solid #ccc;
   border-radius: 10px;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
   width:100%;
   }
   @media (max-width: 767.98px) { 
    .col-md-6 {
        flex: 0 0 auto;
        width: 50%;
    }
}
   
   .card-header {
   background-color: #275FDA;
   color: white;
   padding: 10px;
   border-radius: 10px 10px 0 0;
   }
   .list-group-item {
   padding: 10px;
   }
   .text-danger {
       font-size: 0.875em;
   }
</style>