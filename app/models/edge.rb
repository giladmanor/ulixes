class Edge < ActiveRecord::Base
  belongs_to :source, :class_name=> "Node"
  belongs_to :target, :class_name=> "Node"
end
