// 회원 제명, 회원 수정
const { User } = require('../../models'); // User 시퀄라이즈 모델 import

// 전체 회원 목록 조회 (삭제된 회원 포함, admin 제외)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['user_uuid', 'email', 'name', 'phone', 'address', 'createdAt', 'deletedAt'],
      where: {
        role: 'user' // admin이 아닌 회원만 조회
      },
      order: [['createdAt', 'DESC']], // 최신 가입 순으로 정렬
      paranoid: false // 삭제된 회원도 조회
    });
    res.json(users);
  } catch (err) {
    console.error('회원 목록 조회 실패:', err);
    res.status(500).json({ message: '회원 목록을 불러오는데 실패했습니다.' });
  }
};

// 회원 제명 (소프트 삭제): 삭제 처리
exports.deleteUser = async (req, res) => {
    const { userUuid } = req.params;
    try {
        const user = await User.findOne({
            where: { user_uuid: userUuid }
        });

        if (!user) {
            return res.status(404).json({ message: '해당 회원을 찾을 수 없습니다.' });
        }

        // 소프트 삭제 실행 (deletedAt에 현재 시간이 기록됨)
        await user.destroy();
        
        res.json({ 
            message: '회원이 성공적으로 제명되었습니다.',
            deletedAt: new Date()
        });
    } catch (err) {
        console.error('회원 제명 실패:', err);
        res.status(500).json({ message: '회원 제명에 실패했습니다.' });
    }
};

// 회원 제명 해제 (복구)
exports.restoreUser = async (req, res) => {
    const { userUuid } = req.params;
    try {
        const user = await User.findOne({
            where: { user_uuid: userUuid },
            paranoid: false // 삭제된 회원도 조회
        });

        if (!user) {
            return res.status(404).json({ message: '해당 회원을 찾을 수 없습니다.' });
        }

        // 제명 해제 (deletedAt을 null로 설정)
        await user.restore();
        
        res.json({ 
            message: '회원 제명이 해제되었습니다.',
            restoredAt: new Date()
        });
    } catch (err) {
        console.error('회원 제명 해제 실패:', err);
        res.status(500).json({ message: '회원 제명 해제에 실패했습니다.' });
    }
};

// 회원 한 명 조회
exports.getUserById = async (req, res) => {
  const { userUuid } = req.params;
  try {
    const user = await User.findOne({
      attributes: ['user_uuid', 'email', 'name', 'phone', 'address', 'createdAt', 'deletedAt'],
      where: { user_uuid: userUuid },
      paranoid: false // 삭제된 회원도 조회
    });
    if (!user) {
      return res.status(404).json({ message: '해당 회원을 찾을 수 없습니다.' });
    }
    res.json(user);
  } catch (err) {
    console.error('회원 정보 조회 실패:', err);
    res.status(500).json({ message: '회원 정보를 불러오는데 실패했습니다.' });
  }
};

// 회원 정보 수정
exports.updateUser = async (req, res) => {
    const { userUuid } = req.params;
    const { name, email, phone, address } = req.body;
    try {
      const user = await User.findOne({
        where: { user_uuid: userUuid },
        paranoid: false // 삭제된 회원도 수정 가능하게 하려면 true/false 선택
      });
      if (!user) {
        return res.status(404).json({ message: '해당 회원을 찾을 수 없습니다.' });
      }
      await user.update({ name, email, phone, address });
      res.json({ message: '회원 정보가 수정되었습니다.' });
    } catch (err) {
      console.error('회원 정보 수정 실패:', err);
      res.status(500).json({ message: '회원 정보 수정에 실패했습니다.' });
    }
  };



