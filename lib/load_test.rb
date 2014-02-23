require 'net/http'

class LoadTest
  SERVER = "http://localhost:3000/api/set/"
  ACCOUNT_NUMBER = 3
  ACCOUNT_KEY = "PcD18LoSxnhx7HetBUCi5CMRm8UwdeeA6oa1UrmkG1hhHKOZDG"

  ACTIONS = ["a","b","c","d","e","f","g","h"]
  VALUES = [1,5,10,15]

  def self.user_list(len)
    (1 .. len)
  end

  def self.do

    t = Time.now

    1000.times{
      user_list(1000).each{|uid|
        10.times{
          send({:uuid=>uid, :code=>ACTIONS.shuffle.first, :value=>VALUES.shuffle.first})
        }
        
      }
    }

    p "="*50
    p Time.now - t
    p "="*50
  end

  def self.send(args)
    args.merge!({
      :with_info=>true,
      :a_id=>ACCOUNT_NUMBER,
      :k=>ACCOUNT_KEY
    })

    uri = URI.parse(SERVER)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true if uri.scheme == 'https'
    response = Net::HTTP.post_form(uri, args)
  end

end