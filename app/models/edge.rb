class Edge < ActiveRecord::Base
  belongs_to :account
  belongs_to :source, :class_name=> "Node"
  belongs_to :target, :class_name=> "Node"
  has_many :rules
end
