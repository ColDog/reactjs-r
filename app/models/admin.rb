class Admin < ActiveRecord::Base
  has_secure_password

  # sends a token through the bcrypt system to see if a user is authenticated
  def authenticated?(attribute, token)
    digest = send("#{attribute}_digest")
    return false if digest.nil?
    BCrypt::Password.new(digest).is_password?(token)
  end
end
