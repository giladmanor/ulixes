class DelayedJob < ActiveRecord::Base
    to_info :queue, :created_at, :run_at
end
  