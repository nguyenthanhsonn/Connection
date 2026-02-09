# 📘 DrugConnect API

# 🧑‍💼 User Endpoints
 # Post
  - http://10.243.200.17:5050/users/register (đăng kí)
 # Post
  - http://10.243.200.17:5050/users/login (đăng nhập)
 # Put
  - http://10.243.200.17:5050/users/profiles (cập nhật thông tin user)
 # Get
  - http://10.243.200.17:5050/api/users/profiles/:username (lấy thông tin user theo username)

# 👥 Follow Endpoints
 # Post  
  - http://10.243.200.17:5050/api/follow/userId (follow người dùng)
 # Delete
  - http://10.243.200.17:5050/api/unfollow/userId (unfollow người dùng)
 # Get 
  - http://10.243.200.17:5050/api/:id/followers (xem danh sách follower của user khác)

# 📝 Posts Endpoints
 # Post
  - http://10.243.200.17:5050/api/posts (tạo bài post)
 # Delete
  - http://10.243.200.17:5050/api/posts/:id (xóa bài post) 
 # Put
  - http://10.243.200.17:5050/api/posts/:id (chỉnh sửa bài post)
 # Get
  - http://10.243.200.17:5050/api/posts/:id (lấy bài post theo id)
 # Get
  - http://10.243.200.17:5050/api/posts (Lấy tất cả bài post từ khác người dùng)
 # Post
  - http://10.243.200.17:5050/api/posts/:id/like (Like bài Post) - yêu cầu token
 # Delete
  - http://10.243.200.17:5050/api/posts/:id/like (Dislike bài Post) - yêu cầu token
 # Get
  - http://10.243.200.17:5050/api/posts/:id/like-count  (Đếm số lượng like)
 # Get
  - http://10.243.200.17:5050/api/posts/posts-saved (Xem danh sách lưu bài của người dùng) - yêu cầu token
 # Post
  - http://10.243.200.17:5050/api/posts/save/:id (Lưu bài post)
 # Delete
  - http://10.243.200.17:5050/api/posts/unsave/:id

  
# Comment Endpoints
 # Post
  - http://10.243.200.17:5050/api/comments/:id (Tạo comment)
 # Delete
  - http://10.243.200.17:5050/api/comments/:id (Xóa comment)
 # Put
  - http://10.243.200.17:5050/api/comments/:id (Chỉnh sửa comment)
 

