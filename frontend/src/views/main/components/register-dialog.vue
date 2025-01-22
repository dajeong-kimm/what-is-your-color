<template>
  <div v-if="state.dialogVisible" class="register-dialog-overlay">
    <div class="register-dialog">
      <div class="register-dialog-header">
        <h3>회원가입</h3>
        <button class="close-btn" @click="handleClose">&times;</button>
      </div>
      <form @submit.prevent="submitRegister">
        <!-- 소속 입력 필드 -->
        <div class="form-group">
          <label for="department">소속</label>
          <input type="text" id="department" v-model="state.form.department" />
          <span v-if="errors.department" class="error">{{ errors.department }}</span>
        </div>

        <!-- 직책 입력 필드 -->
        <div class="form-group">
          <label for="position">직책</label>
          <input type="text" id="position" v-model="state.form.position" />
          <span v-if="errors.position" class="error">{{ errors.position }}</span>
        </div>

        <!-- 이름 입력 필드 -->
        <div class="form-group">
          <label for="name">이름</label>
          <input type="text" id="name" v-model="state.form.name" required />
          <span v-if="errors.name" class="error">{{ errors.name }}</span>
        </div>

        <!-- 아이디 입력 필드 -->
        <div class="form-group">
          <label for="userId">아이디</label>
          <input type="text" id="userId" v-model="state.form.userId" required />
          <button type="button" @click="checkUserId">중복 확인</button>
          <span v-if="errors.userId" class="error">{{ errors.userId }}</span>
        </div>

        <!-- 비밀번호 입력 필드 -->
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input type="password" id="password" v-model="state.form.password" required />
          <span v-if="errors.password" class="error">{{ errors.password }}</span>
        </div>

        <!-- 비밀번호 확인 입력 필드 -->
        <div class="form-group">
          <label for="passwordConfirm">비밀번호 확인</label>
          <input type="password" id="passwordConfirm" v-model="state.form.passwordConfirm" required />
          <span v-if="errors.passwordConfirm" class="error">{{ errors.passwordConfirm }}</span>
        </div>

        <div class="dialog-footer">
          <button type="submit" :disabled="!isFormValid" class="btn-primary">가입하기</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive, ref, computed, watch } from 'vue';
import { registerUser, checkUserId } from '@/common/api/userAPI';

export default {
  name: 'RegisterDialog',
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const state = reactive({
      form: {
        department: '',
        position: '',
        name: '',
        userId: '',
        password: '',
        passwordConfirm: ''
      },
      dialogVisible: props.open
    });

    watch(() => props.open, (newVal) => {
      state.dialogVisible = newVal;
    });

    const errors = reactive({
      department: '',
      position: '',
      name: '',
      userId: '',
      password: '',
      passwordConfirm: ''
    });

    const isUserIdAvailable = ref(false);

    const isFormValid = computed(() => {
      return Object.values(errors).every(err => !err) && isUserIdAvailable.value;
    });

    const handleClose = () => {
      state.form.department= '',
      state.form.position= '',
      state.form.name= '',
      state.form.userId= '',
      state.form.password= '',
      state.form.passwordConfirm= ''
      emit('closeRegisterDialog');
    };

    const validateForm = () => {
      let valid = true;
      // 유효성 검사 로직
      if (!state.form.department) {
        errors.department = '소속은 필수 입력 항목입니다.';
        valid = false;
      } else {
        errors.department = '';
      }
      if (!state.form.position) {
        errors.position = '직책은 필수 입력 항목입니다.';
        valid = false;
      } else {
        errors.position = '';
      }
      if (!state.form.name) {
        errors.name = '이름은 필수 입력 항목입니다.';
        valid = false;
      } else {
        errors.name = '';
      }
      if (!state.form.userId) {
        errors.userId = '아이디는 필수 입력 항목입니다.';
        valid = false;
      } else {
        errors.userId = '';
      }
      if (!state.form.password || state.form.password.length < 9 || state.form.password.length > 16) {
        errors.password = '비밀번호는 최소 9글자 이상, 최대 16글자까지 입력 가능합니다.';
        valid = false;
      } else {
        errors.password = '';
      }
      if (state.form.password !== state.form.passwordConfirm) {
        errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
        valid = false;
      } else {
        errors.passwordConfirm = '';
      }

      return valid;
    };

    const submitRegister = async () => {
      if (validateForm()) {
        try {
          const response = await registerUser(state.form);  // API 호출
          alert('회원가입 성공!');
          handleClose();
        } catch (error) {
          alert('회원가입 실패!');
        }
      } else {
        alert('유효성 검사 실패');
      }
    };

    const checkUserId = async () => {
      try {
        const response = await checkUserId(state.form.userId);  // 중복 아이디 확인 API 호출
        if (response.status === 409) {
          errors.userId = '이미 존재하는 아이디입니다.';
          isUserIdAvailable.value = false;
        } else {
          errors.userId = '';
          isUserIdAvailable.value = true;
        }
      } catch (error) {
        errors.userId = '';
        isUserIdAvailable.value = true;
      }
    };

    return {
      state,
      errors,
      isFormValid,
      handleClose,
      submitRegister,
      checkUserId
    };
  }
};
</script>

<style scoped>
/* register-dialog 스타일 추가 */
.register-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.register-dialog {
  background: white;
  padding: 20px;
  width: 400px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.register-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: calc(100% - 20px);
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.error {
  color: red;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.dialog-footer {
  text-align: center;
}

.btn-primary {
  background-color: #409eff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
}
</style>
