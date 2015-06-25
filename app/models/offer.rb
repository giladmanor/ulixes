class Offer < ActiveRecord::Base
  belongs_to :account
  serialize :data, Hash
  
  
  
  
  
end
