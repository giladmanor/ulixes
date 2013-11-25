class Badge < ActiveRecord::Base
  belongs_to :account
  acts_as_image :icon, :placeholder
  to_info :name, :placeholder
  
end
