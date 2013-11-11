require 'acts_as_tree/version'

module Magic

  def self.included(base)
    base.extend(ClassMethods)
  end

  module ClassMethods

    def to_info(options = {})
      configuration = {
        foreign_key:   "parent_id",
        order:         nil,
        counter_cache: nil,
        dependent:     :destroy
      }

      configuration.update(options) if options.is_a?(Hash)

      
      class_eval <<-EOV
        include Magic::InstanceMethods

        after_update :update_parents_counter_cache

        def self.to_info
          order_option = %Q{#{configuration.fetch :order, "nil"}}
          where(:#{configuration[:foreign_key]} => nil).order(order_option)
        end

        def self.root
          order_option = %Q{#{configuration.fetch :order, "nil"}}
          self.roots.first
        end
      EOV
    end

  end

  
  module InstanceMethods
    # Returns list of ancestors, starting from parent until root.
    #
    #   subchild1.ancestors # => [child1, root]
    def ancestors
      node, nodes = self, []
      nodes << node = node.parent while node.parent
      nodes
    end

    # Returns the root node of the tree.
    def root
      node = self
      node = node.parent while node.parent
      node
    end

    # Returns all siblings of the current node.
    #
    #   subchild1.siblings # => [subchild2]
    def siblings
      self_and_siblings - [self]
    end

    # Returns all siblings and a reference to the current node.
    #
    #   subchild1.self_and_siblings # => [subchild1, subchild2]
    def self_and_siblings
      parent ? parent.children : self.class.roots
    end

    # Returns children (without subchildren) and current node itself.
    #
    #   root.self_and_children # => [root, child1]
    def self_and_children
      [self] + self.children
    end

    # Returns ancestors and current node itself.
    #
    #   subchild1.self_and_ancestors # => [subchild1, child1, root]
    def self_and_ancestors
      [self] + self.ancestors
    end

    # Returns true if node has no parent, false otherwise
    #
    #   subchild1.root? # => false
    #   root.root?      # => true
    def root?
      parent.nil?
    end

    # Returns true if node has no children, false otherwise
    #
    #   subchild1.leaf? # => true
    #   child1.leaf?    # => false
    def leaf?
      children.count == 0
    end

    private

    def update_parents_counter_cache
      if self.respond_to?(:children_count) && parent_id_changed?
        self.class.decrement_counter(:children_count, parent_id_was)
        self.class.increment_counter(:children_count, parent_id)
      end
    end
  end
end


