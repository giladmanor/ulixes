class UserScore < ActiveRecord::Base
  belongs_to :user
  belongs_to :scale
  
  to_info :scale_info, :value
  
  def scale_info
    self.scale.to_info
  end
  
end
