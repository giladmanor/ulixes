class Event < ActiveRecord::Base
  belongs_to :user
  belongs_to :scale
  serialize :data, Hash
  
end
