module Magic
  def self.included(base)
    base.extend(ClassMethods)
  end

  module ClassMethods
    def describe(field_name)
      res = {}

      if field_name.include?("_id")
        t = self.reflect_on_association(field_name.gsub("_id", "").to_sym)
        res[:type] = t.macro
        res[:entity] = t.name.to_s.singularize.camelize.constantize
      elsif t = self.serialized_attributes[field_name]
        res[:type] = t.object_class.name
        res[:structure] = self.call("#{field_name}_structure") if self.respond_to?("#{field_name}_structure")
      else
        res[:type] = self.column_types[field_name].type
      end
      res
    end

    def serialized_columns(field, columns_and_options)
      class_eval <<-EB
        def #{field}_structure
          {#{columns_and_options}}
        end

      EB
    end

    def to_info *options
      s = options.map{|v| ":#{v}=>self.#{v.to_s}"}
      #puts s.join(",")

      class_eval <<-EB
        def to_info
          {#{s.join(",")}}
        end

        def self.to_info_keys
          #{options}
        end
      EB
    end
  end

  module InstanceMethods

  end
end

ActiveRecord::Base.send(:include, Magic)

#Account.reflect_on_all_associations(:has_many).first